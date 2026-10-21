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
- 3 / 4 / 5+ scatters award 10 / 12 / 15 free spins.
- 3+ scatters during free spins: +5 spins. No retrigger limit.

## Vault Meter (free spins only)
- Each tumble (cascade after a win) in free spins adds 1 to the meter; the opening drop of a spin does not count.
- At 10 / 20 / 30 one random marked spot jumps one tier (x2->x4 etc., max x128). If no marked spot can be upgraded (none marked, or all marked spots at x128), a random unmarked spot becomes x2. If every spot is already x128, the upgrade is lost.
- Meter persists for the whole free spins round.

## Bet modes (v1)
- base: cost 1x
- bonus: buy free spins, cost 100x
- super: buy free spins with every spot pre-set to x2, cost 400x (may use its own lower free-spin pay scale for RTP tuning)
- ante: cost 1.25x per spin, increased scatter chance in base (free spins target about 1 in 140; scatter weight about 1.2x base, adjusted as needed to hit that rate, then RTP rebalanced to 96.2%)

## Targets
- RTP 96.2% in each mode
- Base hit rate ~1 in 3.5 (currently tuned ~1 in 3.2, accepted)
- Free spins trigger ~1 in 200 in base
- Max win 10,000x bet (hard cap; round ends immediately when reached: no further tumbles or free spins)

## Frontend notes
- Keep max win, top multiplier and bet mode list in config.
- Show per-spot multiplier overlay; show running total win across tumbles.
