// Vault Breakers rules + paytable strings. Single source for the info screen.
// RULES_MD is copied verbatim from docs/RULES.md (commit 621ff4f, branch math-fix-unique-upgrade);
// replace it when docs/RULES.md changes. Figures stay as {{NAMED}} placeholders; fill them in
// RULES_VALUES (one edit). Unfilled values render as [PLACEHOLDER NAME].
import { GAME_NUMBERS } from './gameNumbers';

// figures live in gameNumbers.ts (single edit point)
export const RULES_VALUES = GAME_NUMBERS;

// One paytable for every mode. Optional free-spin pay line: empty = hidden. Set e.g.
// 'Free Spins pay 2x these values.' to switch it on (shown under the paytable and in the rules).
export const FS_PAY_NOTE = 'Free spin wins pay {{FS_MULT}}x the paytable.';
export const PAYTABLE_SIZES = ['5', '6', '7', '8', '9-10', '11-12', '13-15', '16+'] as const;
// payouts in x bet, by cluster size (keys = math symbol IDs)
export const PAYTABLE: { id: string; name: string; pays: number[] }[] = [
	{ id: 'H1', name: 'Gold Bar', pays: [3, 4, 6, 10, 20, 50, 120, 300] },
	{ id: 'H2', name: 'Diamond', pays: [2, 3, 5, 8, 16, 36, 90, 200] },
	{ id: 'H3', name: 'Ruby', pays: [1.6, 2.4, 4, 6, 12, 28, 70, 160] },
	{ id: 'H4', name: 'Emerald', pays: [1.2, 2, 3, 5, 10, 20, 50, 120] },
	{ id: 'L1', name: 'A', pays: [0.8, 1, 1.6, 2.4, 4, 10, 24, 60] },
	{ id: 'L2', name: 'K', pays: [0.6, 0.8, 1.2, 2, 3.2, 8, 20, 50] },
	{ id: 'L3', name: 'Q', pays: [0.5, 0.7, 1, 1.6, 2.6, 6, 16, 40] },
	{ id: 'L4', name: 'J', pays: [0.4, 0.6, 0.8, 1.2, 2, 5, 12, 30] },
];

export const RULES_MD = `
# Vault Breakers – Game Rules

## How to win
- The grid is 5x5. Land 5 or more matching symbols touching up, down, left or right to form a winning cluster.
- Winning symbols are removed, the symbols above fall down, and new ones drop in. This repeats until there are no more wins.
- WILD (dynamite) stands in for any paying symbol. A wild can count in more than one cluster and pays in each one. A cluster needs at least one regular symbol, so a cluster made only of wilds doesn't pay.
- VAULT (scatter) doesn't form clusters and isn't removed by tumbles. It only triggers Free Spins.

## Spot multipliers
- The first win on a spot marks it. Each later win on that spot doubles its multiplier: x2, x4, x8, x16, x32, x64, up to x128.
- Each spot upgrades at most once per tumble, even if it's part of two wins.
- A cluster is multiplied by the total of the multipliers under it. A marked spot with no multiplier counts as 1. If no spot under the cluster is marked, it pays x1.
- In the base game, spots reset every spin. In Free Spins, they stay for the whole round.

## Free Spins
- {{FS_PAY_NOTE}}
- 3, 4 or 5+ VAULTs award 10, 12 or 15 Free Spins.
- 3+ VAULTs during Free Spins add 5 more spins. There's no limit on retriggers.

## Vault Meter (Free Spins only)
- Each tumble after a win adds 1 to the meter. The first drop of each spin doesn't count.
- At 10, 20 and 30, one random marked spot jumps up one level, to a max of x128. If no marked spot can go higher, a random unmarked spot becomes x2 instead. If all 25 spots are already x128, that upgrade is lost.
- The meter carries over for the whole Free Spins round.

## Bet options
- Base: 1x bet.
- Ante: 1.25x bet. VAULTs land more often, so Free Spins trigger about 1 in 140 spins instead of about 1 in 200.
- Bonus Buy: 100x bet. Starts Free Spins right away.
- Super Buy: 400x bet. Starts Free Spins with every spot already at x2.

## Max win and RTP
- Max win is {{MAX_WIN}}x the bet. When it's reached, the round ends right away and pays the max win.
- Theoretical RTP: Base {{RTP_BASE}}%, Ante {{RTP_ANTE}}%, Bonus Buy {{RTP_BONUS}}%, Super Buy {{RTP_SUPER}}%.
- Malfunction voids all pays and plays.
`;

export const fillPlaceholders = (text: string) =>
	text.replace(/\{\{([A-Z_]+)\}\}/g, (_, k) => (k === 'FS_PAY_NOTE' ? fillPlaceholders(FS_PAY_NOTE) : RULES_VALUES[k]) ?? `[PLACEHOLDER ${k}]`);

export type RulesBlock = { heading: string; level: number; items: string[] };
// tiny markdown subset: '#'/'##' headings and '- ' bullets / paragraphs
export const parseRules = (md: string): RulesBlock[] => {
	const blocks: RulesBlock[] = [];
	for (const raw of fillPlaceholders(md).split('\n')) {
		const line = raw.trim();
		if (!line || line === '-') continue;
		const h = line.match(/^(#+)\s+(.*)$/);
		if (h) blocks.push({ heading: h[2], level: h[1].length, items: [] });
		else (blocks.at(-1) ?? blocks[blocks.push({ heading: '', level: 2, items: [] }) - 1]).items.push(line.replace(/^- /, ''));
	}
	return blocks;
};
