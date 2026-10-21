# Vault Breakers — Game Design (v1, locked)

## Overview
5x5 cluster-pays slot with tumbles and persistent spot multipliers. High volatility.

## Grid & pays
- 5x5 grid, cluster pays: 5+ matching symbols connected horizontally/vertically.
- Winning symbols are removed; remaining symbols fall, new symbols fill (tumble). Tumbles repeat until no win.

## Symbols
- High: Gold Bar, Diamond, Ruby, Emerald
- Low: A, K, Q, J
- Wild: substitutes for all paying symbols (base and free spins). A cluster needs at least one paying symbol (no all-wild clusters). A wild in two clusters counts and pays in both.
- Scatter (Vault): triggers free spins; never part of a cluster and never removed by tumbles

## Spot multipliers
- First win on a spot marks it. Each further win on a marked spot doubles its multiplier: x2, x4, ... up to x128.
- A spot is marked or upgraded at most once per tumble, even if it sits in two or more winning clusters.
- Cluster multiplier = sum of spot values across the cluster, where an unmarked spot adds 0, a marked-only spot adds 1, and a multiplied spot adds its multiplier. If the sum is 0 (no marked spots), the cluster pays x1.
- Base game: marks and multipliers reset every spin.
- Free spins: marks and multipliers persist for the whole round.

## Free spins
- Free spins trigger only from base and ante spins. Every tier awards 10 spins; the scatter count picks the tier:
  - 3 scatters: Regular, all spots start unmarked.
  - 4 scatters: Super, every spot starts at x2. No minimum pay.
  - 5+ scatters: Epic, every spot starts at x4. An Epic round always pays at least 200x the base bet from its free spins alone, not counting the triggering spin, in ante too (the math redraws only the Epic free-spin round until it does).
- freeSpinTrigger carries fsType: regular | super | epic.
- 3+ scatters during free spins: +5 spins, same tier. No retrigger limit. The tier never changes mid-round.
- Free spins pay from the same paytable as the base game in every mode (base, ante, bonus, super), with no pay boost. Bigger free-spin wins come from the free-spin reels and the spot multipliers.

## Vault Meter (free spins only)
- Each tumble (cascade after a win) in free spins adds 1 to the meter; the opening drop of a spin does not count.
- At 10 / 20 / 30 one random marked spot jumps one tier (x2->x4 etc., max x128). If no marked spot can be upgraded (none marked, or all marked spots at x128), a random unmarked spot becomes x2. If every spot is already x128, the upgrade is lost.
- Meter persists for the whole free spins round.

## Bet modes (v1)
- base: cost 1x
- bonus: buy Regular free spins, cost 100x
- super: buy Super free spins, cost 400x. Same round as a 4-scatter Super (every spot starts at x2, same pay).
- Epic cannot be bought.
- ante: cost 1.25x per spin, increased scatter chance in base (free spins target about 1 in 140; scatter weight about 1.2x base, adjusted as needed to hit that rate, then RTP rebalanced to 96.2%)

## Targets
- RTP 96.2% in each mode
- Hit rate 1 in 3.44 in base and 1 in 3.42 in ante (each within 3%)
- Free spins trigger 1 in 200 in base and 1 in 140 in ante
- Max win 10,000x bet (hard cap; round ends immediately when reached: no further tumbles or free spins)

## Frontend notes
- Keep max win, top multiplier and bet mode list in config.
- Show per-spot multiplier overlay; show running total win across tumbles.
