// Offline mock RGS. Active when the URL has ?mock=true or no rgs_url is given.
// Serves REAL books sampled from the published math library
// (vault-breakers-math-publish.zip, math commit c679564 (tiered free spins),
// zip sha256 fd7c1401…62a6fba1). Extracted unmodified; payoutMultiplier is in bet x 100 units.
// Fixtures: <mode>_{win,zero,shared,fs,upgrade,retrigger,wincap}, <mode>_tier_<fsType> and
// <mode>_retrigger_<fsType> (first book of each tier; base/ante tier_super/tier_epic = math/samples 15/52), cap_<mode>_<bookId> (every 10,000x
// book in the package: base 8, ante 8, bonus 3, super 4; cap_base_20196 is the cap-rounding case).
// synthetic_* fixtures are derived from bonus_upgrade (marked criteria 'synthetic').
import config from '../game/config';
import { stateBet, stateModal } from 'state-shared';

type Book = { betMode: string; cost: number; id: number; payoutMultiplier: number; criteria: string; events: unknown[] };
const files = import.meta.glob('./books/*.json', { eager: true, import: 'default' }) as Record<string, Book>;
const byName = (n: string) => files[`./books/${n}.json`];
const ORDER: Record<string, string[]> = {
	base: ['base_win', 'base_zero', 'base_shared', 'base_fs'],
	ante: ['ante_win', 'ante_zero', 'ante_shared', 'ante_fs'],
	bonus: ['bonus_fs'],
	super: ['super_fs'],
};
const books: Record<string, Book[]> = Object.fromEntries(
	Object.entries(ORDER).map(([m, names]) => [m, names.map(byName).filter(Boolean)]),
);

const M = 1_000_000; // API_AMOUNT_MULTIPLIER
let balance = 1000 * M;
let betID = 1;
let pendingPayout = 0;

// ?book=wincap forces the real 10,000x book for the current mode.
// ?book=unmarked forces the SYNTHETIC unmarked-spot upgrade fixture (any mode). Otherwise books are
// served round-robin so a test run deterministically walks every sample.
const forced = () =>
	typeof window !== 'undefined' ? new URL(window.location.href).searchParams.get('book') : null;
const counters: Record<string, number> = {};
const pick = (mode: string) => {
	const key = mode.toLowerCase();
	// ?book=<file> (e.g. base_shared, ante_fs, super_wincap) forces any fixture by name
	if (forced() && forced() !== 'wincap' && forced() !== 'unmarked' && byName(forced()!)) return byName(forced()!);
	if (forced() === 'unmarked') return byName('synthetic_unmarked_upgrade');
	// ?book=maxgrid: SYNTHETIC copy of the unmarked fixture with every spot at x128 after the upgrade (Vault Meter MAX test)
	if (forced() === 'maxgrid') return byName('synthetic_maxgrid');
	if (forced() === 'wincap') return byName(`${books[key] ? key : 'base'}_wincap`);
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
		((globalThis as any).__VB_PLAYS__ ??= []).push(mode);
		const costMult = (config.betModes as any)[mode.toLowerCase()]?.cost ?? 1;
		const debit = amount * costMult;
		balance -= debit;
		// book amounts are in units of bet x 100
		const payoutMultiplier = book.payoutMultiplier / 100;
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
				mode: mode.toLowerCase(),
				event: null,
			},
		};
	},
	endEvent: async ({ eventIndex }: { eventIndex: number }) => ({ event: `${eventIndex}` }),
	endRound: async () => {
		balance += pendingPayout;
		pendingPayout = 0;
		return { balance: { amount: balance, currency: 'USD' } };
	},
	replay: async ({ mode }: { mode: string }) => {
		const book = pick(mode);
		return { payoutMultiplier: book.payoutMultiplier / 100, costMultiplier: book.cost, state: book.events };
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
			openPaytable: () => {
				stateModal.modal = { name: 'payTable' };
			},
			openRules: () => {
				stateModal.modal = { name: 'gameRules' };
			},
			// read-only snapshot for e2e checks (amounts in API units)
			snapshot: () => ({ win: stateBet.winBookEventAmount, balance: stateBet.balanceAmount, bet: stateBet.betAmount }),
		};
	}
};
