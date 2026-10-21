import _ from 'lodash';
import config from './config';

import { recordBookEvent, checkIsMultipleRevealEvents, type BookEventHandlerMap } from 'utils-book';
import { stateBet } from 'state-shared';

import { eventEmitter } from './eventEmitter';
import { playBookEvent } from './utils';
import { winLevelMap, type WinLevel, type WinLevelData } from './winLevelMap';
import { stateGame, stateGameDerived } from './stateGame.svelte';
import type { BookEvent, BookEventOfType, BookEventContext } from './typesBookEvent';
import type { Position } from './types';

const winLevelSoundsPlay = ({ winLevelData }: { winLevelData: WinLevelData }) => {
	if (winLevelData?.alias === 'max') eventEmitter.broadcastAsync({ type: 'uiHide' });
	if (winLevelData?.sound?.sfx) {
		eventEmitter.broadcast({ type: 'soundOnce', name: winLevelData.sound.sfx });
	}
	if (winLevelData?.sound?.bgm) {
		eventEmitter.broadcast({ type: 'soundMusic', name: winLevelData.sound.bgm });
	}
	if (winLevelData?.type === 'big') {
		eventEmitter.broadcast({ type: 'soundLoop', name: 'sfx_bigwin_coinloop' });
	}
};

const winLevelSoundsStop = () => {
	eventEmitter.broadcast({ type: 'soundStop', name: 'sfx_bigwin_coinloop' });
	if (stateGame.gameType === 'freegame') {
		// still inside free spins (BONUS or SUPER buy, or triggered)
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_freespin' });
	} else {
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_main' });
	}
	eventEmitter.broadcastAsync({ type: 'uiShow' });
};

// Books can list the same cell more than once (a wild shared by two clusters). Each cell's
// animation resolves once, so a duplicate would wait forever: always animate unique cells.
const uniquePositions = (positions: Position[]) => _.uniqBy(positions, (p) => `${p.reel}:${p.row}`);

// Display-only guard: no on-screen win figure may exceed the 10,000x cap (book units are bet x 100).
// Payouts always come from the RGS / book payoutMultiplier, never from these numbers.
const MAX_WIN_BOOK_AMOUNT = config.betModes.base.max_win * 100;
const capWin = (amount: number) => Math.min(amount, MAX_WIN_BOOK_AMOUNT);

const animateSymbols = async ({ positions: rawPositions }: { positions: Position[] }) => {
	const positions = uniquePositions(rawPositions);
	eventEmitter.broadcast({ type: 'boardShow' });
	await eventEmitter.broadcastAsync({
		type: 'boardWithAnimateSymbols',
		symbolPositions: positions,
	});
};

// total free spins awarded so far in the current feature (for retrigger 'N MORE')
let previousTotalFs = 0;

export const bookEventHandlerMap: BookEventHandlerMap<BookEvent, BookEventContext> = {
	reveal: async (bookEvent: BookEventOfType<'reveal'>, { bookEvents }: BookEventContext) => {
		eventEmitter.broadcast({ type: 'tumbleWinAmountReset' });
		const isBonusGame = checkIsMultipleRevealEvents({ bookEvents });
		if (isBonusGame) {
			eventEmitter.broadcast({ type: 'stopButtonEnable' });
			recordBookEvent({ bookEvent });
		}

		stateGame.gameType = bookEvent.gameType;
		await stateGameDerived.enhancedBoard.spin({ revealEvent: bookEvent });
		eventEmitter.broadcast({ type: 'soundScatterCounterClear' });
	},
	winInfo: async (bookEvent: BookEventOfType<'winInfo'>) => {
		const promise1 = async () => {
			eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_winlevel_small' });
			// a wild can belong to several clusters; animating the same symbol twice never resolves
			await animateSymbols({
				positions: _.flatten(bookEvent.wins.map((win) => win.positions)),
			});
		};

		const promise2 = async () => {
			await eventEmitter.broadcastAsync({
				type: 'showClusterWinAmounts',
				wins: bookEvent.wins.map((win) => {
					return {
						// Vault Breakers: pay = base x sum(spot multipliers) x global
						win: win.meta.winWithoutMult,
						mult: Math.max(1, win.meta.clusterMult) * win.meta.globalMult,
						result: capWin(win.win),
						reel: win.meta.overlay.reel,
						row: win.meta.overlay.row,
					};
				}),
			});
		};

		await Promise.all([promise1(), promise2()]);
	},
	updateTumbleWin: async (bookEvent: BookEventOfType<'updateTumbleWin'>) => {
		if (bookEvent.amount > 0) {
			eventEmitter.broadcast({ type: 'tumbleWinAmountShow' });
			eventEmitter.broadcast({
				type: 'tumbleWinAmountUpdate',
				amount: capWin(bookEvent.amount),
				animate: false,
			});
		}
	},
	// Vault Meter (free spins only; math/EVENTS.md 15-16)
	vaultMeterUpdate: async (bookEvent: BookEventOfType<'vaultMeterUpdate'>) => {
		eventEmitter.broadcast({ type: 'vaultMeterUpdate', meter: bookEvent.meter, nextThreshold: bookEvent.nextThreshold });
	},
	vaultMeterUpgrade: async (bookEvent: BookEventOfType<'vaultMeterUpgrade'>) => {
		eventEmitter.broadcast({ type: 'multiplierGridShow' });
		// fly the new/upgraded multiplier from the meter to its spot, then commit it to the grid
		await eventEmitter.broadcastAsync({
			type: 'vaultFly',
			reel: bookEvent.position.reel,
			row: bookEvent.position.row,
			oldMultiplier: bookEvent.oldMultiplier,
			newMultiplier: bookEvent.newMultiplier,
		});
		eventEmitter.broadcast({ type: 'multiplierGridUpdate', grid: bookEvent.gridMultipliers });
		// NOTE: position here is a 0-based grid index (same layout as gridMultipliers),
		// unlike winInfo/tumbleBoard positions whose row includes the top padding row.
		eventEmitter.broadcast({ type: 'multiplierGridHighlight', reel: bookEvent.position.reel, row: bookEvent.position.row });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_b' });
		await eventEmitter.broadcastAsync({
			type: 'vaultMeterUpgrade',
			meter: bookEvent.meter,
			oldMultiplier: bookEvent.oldMultiplier,
			newMultiplier: bookEvent.newMultiplier,
		});
	},
	wincap: async (bookEvent: BookEventOfType<'wincap'>) => {
		stateBet.winBookEventAmount = capWin(bookEvent.amount);
		// shown at round end: in freeSpinEnd (cut-short free spins) or finalWin (base game)
		stateGame.wincapAmount = bookEvent.amount;
	},
	setTotalWin: async (bookEvent: BookEventOfType<'setTotalWin'>) => {
		stateBet.winBookEventAmount = capWin(bookEvent.amount);
	},
	freeSpinTrigger: async (bookEvent: BookEventOfType<'freeSpinTrigger'>) => {
		eventEmitter.broadcast({ type: 'vaultMeterReset' });
		// tier: read from the event in every mode; missing = 'regular'
		const tier = bookEvent.fsType ?? 'regular';
		const startValues = (bookEvent.startGrid ?? []).flat().filter((m) => m > 1);
		stateGame.fsTier = tier;
		stateGame.fsStartMult = startValues.length ? Math.min(...startValues) : 0;
		// original tier stingers (code-synthesised, see static/assets/audio)
		if (tier !== 'regular') eventEmitter.broadcast({ type: 'soundOnce', name: tier === 'epic' ? 'sfx_tier_epic' : 'sfx_tier_super' });
		// animate scatters
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		// show free spin intro
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_freespin' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
			tier: stateGame.fsTier,
			startMultiplier: stateGame.fsStartMult,
		});
		previousTotalFs = bookEvent.totalFs;
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
		eventEmitter.broadcast({ type: 'vaultMeterShow' });
		eventEmitter.broadcast({ type: 'boardFrameGlowShow' });
		eventEmitter.broadcast({ type: 'globalMultiplierShow' });
		await eventEmitter.broadcastAsync({
			type: 'globalMultiplierUpdate',
			multiplier: 1, // resets when multiplier === 1
		});
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: undefined,
			total: bookEvent.totalFs,
		});
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerButtonShow' });
		eventEmitter.broadcast({ type: 'drawerFold' });
	},
	freeSpinRetrigger: async (bookEvent: BookEventOfType<'freeSpinRetrigger'>) => {
		// animate scatters
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_scatter_win_v2' });
		await animateSymbols({ positions: bookEvent.positions });
		// show free spin intro
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_superfreespin' });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'freeSpinIntroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'jng_intro_fs' });
		eventEmitter.broadcast({ type: 'soundMusic', name: 'bgm_freespin' });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinIntroUpdate',
			totalFreeSpins: bookEvent.totalFs,
			tier: stateGame.fsTier, // a retrigger keeps the tier
			// spins added = new total minus previous total (from the event, not hardcoded)
			extraSpins:
				previousTotalFs > 0 && bookEvent.totalFs > previousTotalFs ? bookEvent.totalFs - previousTotalFs : undefined,
		});
		previousTotalFs = bookEvent.totalFs;
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'freeSpinIntroHide' });
		eventEmitter.broadcast({ type: 'vaultMeterShow' });
		eventEmitter.broadcast({ type: 'boardFrameGlowShow' });
		eventEmitter.broadcast({ type: 'globalMultiplierShow' });
		await eventEmitter.broadcastAsync({
			type: 'globalMultiplierUpdate',
			multiplier: 1, // resets when multiplier === 1
		});
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: undefined,
			total: bookEvent.totalFs,
		});
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
	},
	updateFreeSpin: async (bookEvent: BookEventOfType<'updateFreeSpin'>) => {
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: bookEvent.amount,
			total: bookEvent.total,
		});
	},
	updateGlobalMult: async (bookEvent: BookEventOfType<'updateGlobalMult'>) => {
		eventEmitter.broadcast({ type: 'globalMultiplierShow' });
		if (bookEvent.globalMult === 1) {
			eventEmitter.broadcast({ type: 'tumbleWinAmountReset' });
		}
		await eventEmitter.broadcastAsync({
			type: 'globalMultiplierUpdate',
			multiplier: bookEvent.globalMult, // resets when multiplier === 1
		});
	},
	freeSpinEnd: async (bookEvent: BookEventOfType<'freeSpinEnd'>) => {
		const winLevelData = winLevelMap[bookEvent.winLevel as WinLevel];
		if (stateGame.wincapAmount !== null) {
			// hide the bet bar so TAP TO CONTINUE never sits on its buttons (the outro below keeps it hidden)
			await eventEmitter.broadcastAsync({ type: 'uiHide' });
			await eventEmitter.broadcastAsync({ type: 'maxWinShow', amount: stateGame.wincapAmount });
			stateGame.wincapAmount = null;
		}

		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		stateGame.gameType = 'basegame';
		eventEmitter.broadcast({ type: 'boardFrameGlowHide' });
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'freeSpinOutroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_youwon_panel' });
		winLevelSoundsPlay({ winLevelData });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinOutroCountUp',
			amount: capWin(bookEvent.amount),
			winLevelData,
			tier: stateGame.fsTier,
		});
		winLevelSoundsStop();
		eventEmitter.broadcast({ type: 'freeSpinOutroHide' });
		eventEmitter.broadcast({ type: 'freeSpinCounterHide' });
		eventEmitter.broadcast({ type: 'vaultMeterHide' });
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'tumbleWinAmountHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerUnfold' });
		eventEmitter.broadcast({ type: 'drawerButtonHide' });
	},
	tumbleBoard: async (bookEvent: BookEventOfType<'tumbleBoard'>) => {
		eventEmitter.broadcast({ type: 'boardHide' });
		eventEmitter.broadcast({ type: 'tumbleBoardShow' });
		eventEmitter.broadcast({ type: 'tumbleBoardInit', addingBoard: bookEvent.newSymbols });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_multiplier_explosion_b' });
		await eventEmitter.broadcastAsync({
			type: 'tumbleBoardExplode',
			explodingPositions: uniquePositions(bookEvent.explodingSymbols),
		});
		eventEmitter.broadcast({ type: 'tumbleBoardRemoveExploded' });
		await eventEmitter.broadcastAsync({ type: 'tumbleBoardSlideDown' });
		eventEmitter.broadcast({
			type: 'boardSettle',
			board: stateGameDerived
				.tumbleBoardCombined()
				.map((tumbleReel) => tumbleReel.map((tumbleSymbol) => tumbleSymbol.rawSymbol)),
		});
		eventEmitter.broadcast({ type: 'tumbleBoardReset' });
		eventEmitter.broadcast({ type: 'tumbleBoardHide' });
		eventEmitter.broadcast({ type: 'boardShow' });
	},
	setWin: async (bookEvent: BookEventOfType<'setWin'>) => {
		const winLevelData = winLevelMap[bookEvent.winLevel as WinLevel];

		eventEmitter.broadcast({ type: 'winShow' });
		winLevelSoundsPlay({ winLevelData });
		await eventEmitter.broadcastAsync({
			type: 'winUpdate',
			amount: capWin(bookEvent.amount),
			winLevelData,
		});
		winLevelSoundsStop();
		eventEmitter.broadcast({ type: 'winHide' });
	},
	updateGrid: async (bookEvent: BookEventOfType<'updateGrid'>) => {
		eventEmitter.broadcast({ type: 'multiplierGridShow' });
		eventEmitter.broadcast({ type: 'multiplierGridUpdate', grid: bookEvent.gridMultipliers });
	},
	finalWin: async (bookEvent: BookEventOfType<'finalWin'>) => {
		if (stateGame.wincapAmount !== null) {
			// hide the bet bar while MAX WIN REACHED shows its TAP TO CONTINUE, then bring it back
			await eventEmitter.broadcastAsync({ type: 'uiHide' });
			await eventEmitter.broadcastAsync({ type: 'maxWinShow', amount: stateGame.wincapAmount });
			stateGame.wincapAmount = null;
			await eventEmitter.broadcastAsync({ type: 'uiShow' });
		}
		eventEmitter.broadcast({ type: 'multiplierGridClear' });
		eventEmitter.broadcast({ type: 'multiplierGridHide' });
		eventEmitter.broadcast({ type: 'globalMultiplierHide' });
		eventEmitter.broadcast({ type: 'tumbleWinAmountHide' });
	},
	// customised
	createBonusSnapshot: async (bookEvent: BookEventOfType<'createBonusSnapshot'>) => {
		const { bookEvents } = bookEvent;

		function findLastBookEvent<T>(type: T) {
			return _.findLast(bookEvents, (bookEvent) => bookEvent.type === type) as
				| BookEventOfType<T>
				| undefined;
		}

		const lastFreeSpinTriggerEvent = findLastBookEvent('freeSpinTrigger' as const);
		const lastUpdateFreeSpinEvent = findLastBookEvent('updateFreeSpin' as const);
		const lastSetTotalWinEvent = findLastBookEvent('setTotalWin' as const);
		const lastUpdateGlobalMultEvent = findLastBookEvent('updateGlobalMult' as const);

		if (lastFreeSpinTriggerEvent) await playBookEvent(lastFreeSpinTriggerEvent, { bookEvents });
		if (lastUpdateFreeSpinEvent) playBookEvent(lastUpdateFreeSpinEvent, { bookEvents });
		if (lastSetTotalWinEvent) playBookEvent(lastSetTotalWinEvent, { bookEvents });
		if (lastUpdateGlobalMultEvent) playBookEvent(lastUpdateGlobalMultEvent, { bookEvents });
	},
};
