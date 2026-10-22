// Vault Breakers bet-mode metadata, paytable and rules, built from game/config.ts.
import { stateMeta, type BetModeMeta } from 'state-shared';
import config from './config';

const svg = (label: string, color: string) =>
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect rx="18" width="128" height="128" fill="${color}"/><text x="64" y="76" font-size="30" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${label}</text></svg>`,
	);

const SYMBOL_COLORS: Record<string, string> = {
	H1: '#c9a227', H2: '#5fb7e8', H3: '#c0283a', H4: '#239a5a',
	L1: '#6b5bd2', L2: '#4f7bd2', L3: '#3f9bb0', L4: '#4a8a5c', W: '#e07b00', S: '#7a2bbd',
};
export const symbolImage = (name: string) =>
	svg(name === 'S' ? 'VAULT' : name === 'W' ? 'WILD' : (config.symbols as any)[name].label.split(' ')[0].slice(0, 7), SYMBOL_COLORS[name] ?? '#444');

// Vault Breakers buy-menu icons (static/assets/sprites/vaultBreakers/icon_*.png)
const bonusIcon = new URL('../../assets/sprites/vaultBreakers/icon_bonus.png', import.meta.url).href;
const superIcon = new URL('../../assets/sprites/vaultBreakers/icon_super.png', import.meta.url).href;
const anteIcon = new URL('../../assets/sprites/vaultBreakers/icon_ante.png', import.meta.url).href;
const fs = config.freeSpins;
const maxWin = config.maxWin.toLocaleString('en-US');

export const BET_MODE_META: BetModeMeta = {
	base: {
		mode: 'base', costMultiplier: config.betModes.base.cost, type: 'default', parent: '', children: '',
		maxWin: config.maxWin,
		assets: { icon: bonusIcon, volatility: bonusIcon, button: bonusIcon, dialogImage: bonusIcon, dialogVolatility: bonusIcon },
		text: { title: 'BASE', dialog: '', button: '', tickerIdle: 'PLACE YOUR BET', tickerSpin: 'GOOD LUCK' },
	},
	ante: {
		mode: 'ante', costMultiplier: config.betModes.ante.cost, type: 'activate', parent: '', children: '',
		maxWin: config.maxWin,
		assets: { icon: anteIcon, volatility: anteIcon, button: anteIcon, dialogImage: anteIcon, dialogVolatility: anteIcon },
		text: {
			title: 'ANTE BET',
			dialog: `Costs ${config.betModes.ante.cost}x the bet per spin and adds more Vault Scatters to the base game, so Free Spins trigger more often (about 1 in 140 spins instead of 1 in 200). Stays on until turned off.`,
			description: 'More Vault Scatters in the base game.',
			button: 'ACTIVATE',
			betAmountLabel: 'ANTE',
			tickerIdle: 'ANTE BET IS ACTIVE',
			tickerSpin: 'GOOD LUCK',
		},
	},
	bonus: {
		mode: 'bonus', costMultiplier: config.betModes.bonus.cost, type: 'buy', parent: '', children: '',
		maxWin: config.maxWin,
		assets: { icon: bonusIcon, volatility: bonusIcon, button: bonusIcon, dialogImage: bonusIcon, dialogVolatility: bonusIcon },
		text: {
			title: 'VAULT BONUS',
			dialog: `Triggers FREE SPINS for ${config.betModes.bonus.cost}x the bet. Spot multipliers persist for the whole feature, up to x${config.maxSpotMultiplier}.`,
			description: 'Regular Free Spins',
			button: 'BUY',
			tickerIdle: 'PLACE YOUR BET',
			tickerSpin: 'VAULT BONUS ACTIVATED',
		},
	},
	super: {
		mode: 'super', costMultiplier: config.betModes.super.cost, type: 'buy', parent: '', children: '',
		maxWin: config.maxWin,
		assets: { icon: superIcon, volatility: superIcon, button: superIcon, dialogImage: superIcon, dialogVolatility: superIcon },
		text: {
			title: 'SUPER VAULT',
			dialog: `Triggers FREE SPINS for ${config.betModes.super.cost}x the bet with every spot starting at x${config.betModes.super.startingSpotMultiplier}.`,
			description: 'Super Free Spins, x2 spots',
			button: 'BUY',
			tickerIdle: 'PLACE YOUR BET',
			tickerSpin: 'SUPER VAULT ACTIVATED',
		},
	},
};

const BUCKETS = ['5', '6', '7', '8', '9-10', '11-12', '13-15', '16+'];
const payText = (name: string) => {
	const pt = (config.symbols as any)[name].paytable as Record<string, number>;
	return [...BUCKETS].reverse().map((b) => `${b}\t|\t${pt[b]}x`).join('\n');
};
const PAY_SYMBOLS = ['H1', 'H2', 'H3', 'H4', 'L1', 'L2', 'L3', 'L4'];

export const GAME_RULE_META = {
	payTable: [
		{
			title: 'PAYTABLE',
			rows: 3,
			columns: 1,
			containers: [
				{ title: 'WILD', text: 'Wild substitutes for all paying symbols except the Vault Scatter.', image: symbolImage('W'), imagePosition: 'left' as const, row: 0, column: 0 },
				{ title: 'VAULT SCATTER', text: `3 / 4 / 5+ Vault Scatters award ${fs['3']} / ${fs['4']} / ${fs['5+']} FREE SPINS. During FREE SPINS, 3 Scatters award +${fs.retrigger} spins.`, image: symbolImage('S'), imagePosition: 'left' as const, row: 1, column: 0 },
				{ title: 'MAX WIN', text: `Maximum win is ${maxWin}x the bet. The round ends when it is reached.`, image: symbolImage('H1'), imagePosition: 'left' as const, row: 2, column: 0 },
			],
		},
		{
			title: 'SYMBOL PAYS (x bet, by cluster size)',
			rows: 2,
			columns: 4,
			containers: PAY_SYMBOLS.map((name, i) => ({
				title: (config.symbols as any)[name].label,
				text: payText(name),
				image: symbolImage(name),
				imagePosition: 'top' as const,
				row: Math.floor(i / 4),
				column: i % 4,
			})),
		},
	],
	gameRules: [
		{
			title: 'GAME RULES',
			rows: 5,
			columns: 1,
			containers: [
				{ title: 'VAULT METER', text: `FREE SPINS only. Every tumble adds 1 to the Vault Meter. At ${config.vaultMeter.thresholds.join(' / ')} a random marked spot moves up one tier (max x${config.maxSpotMultiplier}); if no spot is marked, a random spot becomes x2. The meter keeps its value for the whole feature.`, image: symbolImage('S'), imagePosition: 'left' as const, row: 4, column: 0 },
				{ title: 'CLUSTER PAYS', text: `${config.numReels}x${config.numRows[0]} grid. Clusters of ${config.minClusterSize}+ matching symbols connected horizontally or vertically pay. Winning symbols explode and new symbols tumble in until no more wins.`, image: symbolImage('H2'), imagePosition: 'left' as const, row: 0, column: 0 },
				{ title: 'SPOT MULTIPLIERS', text: `A winning symbol marks its cell. Each further win on a marked cell doubles its multiplier, from x2 up to x${config.maxSpotMultiplier}. A cluster pays its base pay times the sum of the multipliers under it. Spots reset every base spin and persist through FREE SPINS.`, image: symbolImage('H3'), imagePosition: 'left' as const, row: 1, column: 0 },
				{ title: 'BONUS BUY / ANTE', text: `Buy FREE SPINS for ${config.betModes.bonus.cost}x the bet, or SUPER VAULT for ${config.betModes.super.cost}x with every spot starting at x${config.betModes.super.startingSpotMultiplier}. ANTE BET costs ${config.betModes.ante.cost}x per spin for more Vault Scatters.`, image: symbolImage('S'), imagePosition: 'left' as const, row: 2, column: 0 },
				{ title: 'RTP', text: `Theoretical RTP ${(config.rtp * 100).toFixed(2)}%. Malfunction voids all pays and plays.`, image: symbolImage('H4'), imagePosition: 'left' as const, row: 3, column: 0 },
			],
		},
	],
	splashScreen: [],
};

export const applyMeta = () => {
	stateMeta.betModeMeta = BET_MODE_META;
	// @ts-ignore structure matches GameRuleMeta
	stateMeta.gameRuleMeta = { ...stateMeta.gameRuleMeta, ...GAME_RULE_META };
};
