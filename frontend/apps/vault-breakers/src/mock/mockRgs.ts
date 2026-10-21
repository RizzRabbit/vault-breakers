// Offline mock RGS. Active when the URL has ?mock=true or no rgs_url is given.
// Serves the math team's sample books (math/samples/*.json) in the same response
// shapes the Stake RGS returns for /wallet/authenticate, /wallet/play, /wallet/end-round.
import baseSample from './base_sample.json';
import bonusSample from './bonus_sample.json';
// SYNTHETIC fixture for the provisional super-buy / Vault Meter UI (see README)
import superMock from './super_mock.json';
import anteMock from './ante_mock.json';
import wincapMock from './wincap_mock.json';
import config from '../game/config';
import { stateBet, stateModal } from 'state-shared';

const M = 1_000_000; // API_AMOUNT_MULTIPLIER
let balance = 1000 * M;
let betID = 1;
let pendingPayout = 0;

type Book = { betMode: string; cost: number; totalWin: number; events: unknown[] };
const books: Record<string, Book[]> = {
	base: [baseSample as Book],
	bonus: [bonusSample as Book],
	// no ante sample exists yet; ante base-game books share the base event schema
	ante: [anteMock as Book],
	super: [superMock as Book],
};

// ?book=wincap forces the synthetic 10,000x book (any buy mode); otherwise books are
// served round-robin so a test run deterministically walks every sample.
const forced = () =>
	typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('book') : null;
const counters: Record<string, number> = {};
const pick = (mode: string) => {
	if (forced() === 'wincap') return wincapMock as Book;
	const key = mode.toLowerCase();
	const l = books[key] ?? books.base;
	counters[key] = (counters[key] ?? -1) + 1;
	return l[counters[key] % l.length];
};

export const mockRgs = {
	authenticate: async () => ({
		balance: { amount: balance, currency: 'USD' },
		config: {
			gameID: config.gameID,
			minBet: 0.1 * M,
			maxBet: 100 * M,
			stepBet: 0.1 * M,
			defaultBetLevel: 1 * M,
			betLevels: [0.1, 0.2, 0.4, 0.6, 0.8, 1, 2, 4, 5, 10, 20, 50, 100].map((v) => v * M),
			betModes: {},
			jurisdiction: {
				socialCasino: false,
				disabledFullscreen: false,
				disabledTurbo: false,
				disabledSuperTurbo: false,
				disabledAutoplay: false,
				disabledSlamstop: false,
				disabledSpacebar: false,
				disabledBuyFeature: false,
				displayNetPosition: false,
				displayRTP: false,
				displaySessionTimer: false,
				minimumRoundDuration: 0,
			},
		},
		round: null,
	}),
	play: async ({ amount, mode }: { amount: number; mode: string }) => {
		const book = pick(mode);
		const costMult = (config.betModes as any)[mode.toLowerCase()]?.cost ?? 1;
		const debit = amount * costMult;
		balance -= debit;
		// book amounts are in units of bet x 100
		const payoutMultiplier = book.totalWin / 100;
		const payout = Math.round(amount * payoutMultiplier);
		pendingPayout = payout;
		return {
			balance: { amount: balance, currency: 'USD' },
			round: {
				betID: betID++,
				amount: debit,
				payout,
				payoutMultiplier,
				active: payout > 0,
				state: book.events,
				mode: mode.toUpperCase(),
				event: null,
			},
		};
	},
	endRound: async () => {
		balance += pendingPayout;
		pendingPayout = 0;
		return { balance: { amount: balance, currency: 'USD' } };
	},
	replay: async ({ mode }: { mode: string }) => {
		const book = pick(mode);
		return { payoutMultiplier: book.totalWin / 100, costMultiplier: book.cost / 100, state: book.events };
	},
};

export const isMockMode = (url: URL) =>
	url.searchParams.get('mock') === 'true' || !url.searchParams.get('rgs_url');

export const registerMockRgs = () => {
	if (typeof window === 'undefined') return;
	if (isMockMode(new URL(window.location.href))) {
		(globalThis as any).__VB_MOCK_RGS__ = mockRgs;
		// mock-only helper so headless tests can pick a bet mode without pixel-clicking
		(globalThis as any).__VB_TEST__ = {
			setMode: (key: string) => {
				stateBet.activeBetModeKey = key;
			},
			openBuyMenu: () => {
				stateModal.modal = { name: 'buyBonus' };
			},
		};
	}
};
