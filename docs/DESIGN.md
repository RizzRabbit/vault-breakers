# Vault Breakers — Game Design (v1, locked)

## Overview
5x5 cluster-pays slot with tumbles and persistent spot multipliers. High volatility.

## Grid & pays
- 5x5 grid, cluster pays: 5+ matching symbols connected horizontally/vertically.
- Winning symbols are removed; remaining symbols fall, new symbols fill (tumble). Tumbles repeat until no win.

## Symbols
- High: Gold Bar, Diamond, Ruby, Emerald
- Low: A, K, Q, J
- Wild: substitutes for all paying symbols (base and free spins)
- Scatter (Vault): triggers free spins; does not pay in clusters

## Spot multipliers
- First win on a spot marks it (no multiplier yet).
- Each further win on a marked spot sets/doubles its multiplier: x2, x4, ... up to x128.
- A cluster pays base amount x (sum of multipliers on its spots); if no spot has a multiplier, x1.
- Base game: marks and multipliers reset every spin.
- Free spins: marks and multipliers persist for the whole round.

## Free spins
- 3 / 4 / 5+ scatters award 10 / 12 / 15 free spins.
- 3+ scatters during free spins: +5 spins.

## Vault Meter (free spins only)
- Each tumble in free spins adds 1 to the meter.
- At 10 / 20 / 30 one random marked spot jumps one tier (x2->x4 etc., max x128). If no spot is marked, a random spot becomes x2.
- Meter persists for the whole free spins round.

## Bet modes (v1)
- base: cost 1x
- bonus: buy free spins, cost 100x
- super: buy free spins with every spot pre-set to x2, cost 400x
- ante: cost 1.25x per spin, increased scatter chance in base (about 1.4x, tuned so ante RTP is 96.2%)

## Targets
- RTP 96.2% in each mode
- Base hit rate ~1 in 3.5 (currently tuned ~1 in 3.2, accepted)
- Free spins trigger ~1 in 200 in base
- Max win 10,000x bet (hard cap; round ends when reached)

## Frontend notes
- Keep max win, top multiplier and bet mode list in config.
- Show per-spot multiplier overlay; show running total win across tumbles.
