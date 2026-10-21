# Vault Breakers Event Types

This file describes every event type that Vault Breakers books emit. Field names and examples come from the books in `math/samples/` and from the emitting code (`src/events/events.py` and `games/vault_breakers/game_events.py`).

## Conventions

### Event structure
```json
{"index": 0, "type": "eventType", "...": "..."}
```
- `index`: the event's sequence number within the book (0-based)
- `type`: the event type identifier

### Amounts
Every `amount`, `win` and `totalWin` value is an integer: the bet multiplier × 100. For example, `390` means a 3.9× win. Cluster wins are rounded to 0.1×, so amounts are always multiples of 10. The exception is `meta.winWithoutMult`, which is the unrounded paytable value × 100, so it can end in another digit (for example `97`).

### Coordinate systems (important)
The `reveal` board has **7 rows per reel**: 1 padding row on top, the 5 visible rows, and 1 padding row on the bottom. The board is indexed `board[reel][row]`. Two coordinate systems are in use:

| System | Rows | Used by |
|---|---|---|
| **Padded board** | 0–6, visible rows are **1–5** | `winInfo.wins[].positions`, `winInfo.wins[].meta.overlay`, `tumbleBoard.explodingSymbols`, `freeSpinTrigger.positions`, `freeSpinRetrigger.positions` |
| **Visible grid, 0-based** | 0–4 | `updateGrid.gridMultipliers[reel][row]`, `vaultMeterUpgrade.position`, `vaultMeterUpgrade.gridMultipliers` |

To convert, use `gridRow = paddedRow - 1`. Reels are 0–4 in both systems. These were checked against the sample books: `winInfo` positions index the matching symbols in `reveal.board`, and the `gridMultipliers` cells marked after a win equal the win positions with 1 subtracted from each row.

## Event types

### reveal
A new board drawn from the reel strips at the start of every base spin and every free spin. Tumbles do not emit a `reveal`; see `tumbleBoard`.
- `board`: a 5 × 7 array (`[reel][row]`, padded). Each cell is `{"name": "H1"}`; scatters carry `"scatter": true` and wilds carry `"wild": true`.
- `paddingPositions`: the stop position of each reel on its strip (5 ints)
- `gameType`: `"basegame"` or `"freegame"`
- `anticipation`: an array of 5 ints, one per reel. A value above 0 marks a reel that shows scatter anticipation (for example `[0, 0, 1, 2, 3]`).
```json
{"index": 0, "type": "reveal", "board": [[{"name": "L4"}, {"name": "S", "scatter": true}, ...], ...],
 "paddingPositions": [380, 480, 889, 252, 389], "gameType": "basegame", "anticipation": [0, 0, 0, 0, 0]}
```

### winInfo
All clusters that pay on the current board, emitted once per winning board state.
- `totalWin`: the win of this board state × 100
- `wins[]`:
  - `symbol` and `clusterSize`
  - `win`: the cluster win × 100, after multipliers
  - `positions`: `[{reel, row}]` in **padded-board** coordinates (wilds included)
  - `meta.globalMult`: always 1
  - `meta.clusterMult`: the sum of the spot values under the cluster (marked = 1, then 2, 4 … 128; unmarked = 0), or 1 if that sum is 0
  - `meta.winWithoutMult`: the paytable value × 100, before multipliers and before rounding
  - `meta.overlay`: `{reel, row}`, the cluster's central cell in **padded-board** coordinates
```json
{"index": 6, "type": "winInfo", "totalWin": 100, "wins": [{"symbol": "L2", "clusterSize": 5, "win": 100,
  "positions": [{"reel": 2, "row": 3}, {"reel": 3, "row": 3}, {"reel": 3, "row": 2}, {"reel": 3, "row": 1}, {"reel": 3, "row": 4}],
  "meta": {"globalMult": 1, "clusterMult": 1, "winWithoutMult": 97, "overlay": {"reel": 3, "row": 3}}}]}
```

### updateTumbleWin
The running win of the current spin's tumble sequence, emitted after each `winInfo`.
- `amount`: the cumulative spin win so far × 100
```json
{"index": 7, "type": "updateTumbleWin", "amount": 100}
```

### updateGrid
A snapshot of the spot multipliers.
- `gridMultipliers`: a 5 × 5 array, `[reel][row]`, in **visible-grid 0-based** coordinates. `0` means unmarked, `1` means marked (no multiplier yet), and `2` through `128` are multipliers that double on each further win.

**When it's emitted:**
- after each winning board state, once the marks and multipliers are updated (base game and free spins)
- after every free-spin `reveal`, showing the persistent grid
- once right after every `freeSpinTrigger` (all modes), carrying the tier's start grid: `0` for regular, `2` for super, `4` for epic
```json
{"index": 4, "type": "updateGrid", "gridMultipliers": [[0,0,0,0,0],[0,1,0,0,0],[1,1,1,1,0],[0,1,0,0,0],[0,0,0,0,0]]}
```

### tumbleBoard
The winning symbols explode and new symbols drop in.
- `explodingSymbols`: `[{reel, row}]` in **padded-board** coordinates
- `newSymbols`: one list per reel with the symbols that drop in (`[{"name": ...}]`), ordered top to bottom; a reel with nothing new has an empty list
```json
{"index": 9, "type": "tumbleBoard", "newSymbols": [[], [], [{"name": "L3"}], [{"name": "L1"}, {"name": "L4"}, {"name": "L1"}, {"name": "H1"}], []],
 "explodingSymbols": [{"reel": 2, "row": 3}, {"reel": 3, "row": 3}]}
```

### vaultMeterUpdate (free spins only)
Emitted after every `tumbleBoard` in free spins. The meter goes up by 1 and keeps its value for the whole round, retriggers included. It starts at 0 in each new free-spins round.
- `meter`: the meter value after this tumble
- `nextThreshold`: the next upgrade point (10, 20 or 30), or `null` once 30 has passed
```json
{"index": 15, "type": "vaultMeterUpdate", "meter": 1, "nextThreshold": 10}
```

### vaultMeterUpgrade (free spins only)
Emitted right after the `vaultMeterUpdate` that reaches 10, 20 or 30. One random marked spot below x128 moves up one tier (marked → x2 → x4 … capped at x128). If no spot qualifies, a random unmarked spot becomes x2.
- `meter`: 10, 20 or 30
- `position`: `{reel, row}` in **visible-grid 0-based** coordinates
- `oldMultiplier`: the previous value (0 = unmarked, 1 = marked)
- `newMultiplier`: the new value
- `gridMultipliers`: the full grid after the upgrade, in the same layout as `updateGrid`
```json
{"index": 89, "type": "vaultMeterUpgrade", "meter": 10, "position": {"reel": 0, "row": 0},
 "oldMultiplier": 4, "newMultiplier": 8, "gridMultipliers": [[8,0,2,1,2],[8,4,8,2,4],[8,1,16,16,2],[8,16,8,2,0],[2,2,2,4,1]]}
```

### setWin
The spin's total win, emitted at the end of a tumble sequence **only when the spin won something** (and the win cap was not hit).
- `amount`: the spin win × 100
- `winLevel`: an integer from 1 to 10 on the "standard" scale, by spin win in ×: 1 = [0, 0.1), 2 = [0.1, 1), 3 = [1, 2), 4 = [2, 5), 5 = [5, 15), 6 = [15, 30), 7 = [30, 50), 8 = [50, 100), 9 = [100, 10000), 10 = 10000 or more
```json
{"index": 11, "type": "setWin", "amount": 100, "winLevel": 3}
```

### setTotalWin
The running total for the whole round (base plus free spins so far), emitted at the end of every spin's tumble sequence, including spins that win nothing.
- `amount`: the cumulative round win × 100
```json
{"index": 1, "type": "setTotalWin", "amount": 0}
```

### freeSpinTrigger
Free spins are awarded. It appears after the base spin's `setTotalWin`. Bonus and super books also start with a forced base `reveal` that has 3 scatters, followed by this event.
- `totalFs`: the number of spins awarded: always 10 (every tier, buys included)
- `fsType`: `"regular"` | `"super"` | `"epic"`. Base/ante: 3 scatters = regular (spots unmarked), 4 = super (all spots x2), 5+ = epic (all spots x4; the free-spin round always pays at least 200x base bet). Bonus buy is always `regular`, super buy always `super`; epic is never bought.
- `positions`: scatter `[{reel, row}]` in **padded-board** coordinates
```json
{"index": 2, "type": "freeSpinTrigger", "totalFs": 10, "fsType": "regular", "positions": [{"reel": 0, "row": 1}, {"reel": 3, "row": 2}, {"reel": 4, "row": 5}]}
```

### updateFreeSpin
The start of each free spin, emitted before its `reveal`.
- `amount`: the current spin number (1-based)
- `total`: the total spins in the round, including retriggers awarded so far
```json
{"index": 3, "type": "updateFreeSpin", "amount": 1, "total": 10}
```

### freeSpinRetrigger
3 or more scatters landed during a free spin, adding +5 spins. It appears after that spin's `setTotalWin`. The code emits it, but none of the current sample books contain one.
- `totalFs`: the new total number of spins (+5 per retrigger, unlimited)
- `fsType`: the round's tier, unchanged by retriggers
- `positions`: scatter `[{reel, row}]` in **padded-board** coordinates
```json
{"index": 45, "type": "freeSpinRetrigger", "totalFs": 15, "fsType": "regular", "positions": [{"reel": 1, "row": 2}, {"reel": 3, "row": 3}, {"reel": 4, "row": 1}]}
```

### freeSpinEnd
The free-spins round is over.
- `amount`: the free-spins win × 100 (capped)
- `winLevel`: an integer from 1 to 10 on the "endFeature" scale, by free-spins win in ×: 1 = [0, 1), 2 = [1, 5), 3 = [5, 10), 4 = [10, 20), 5 = [20, 50), 6 = [50, 100), 7 = [100, 500), 8 = [500, 2000), 9 = [2000, 10000), 10 = 10000 or more
```json
{"index": 72, "type": "freeSpinEnd", "amount": 7510, "winLevel": 6}
```

### wincap
The round reached 10,000× and play stops: no more tumbles or spins. The code emits it (after the `updateTumbleWin` that crosses the cap), but none of the current sample books contain one.
- `amount`: the capped win × 100 (`1000000` = 10,000×)
```json
{"index": 78, "type": "wincap", "amount": 1000000}
```

### finalWin
The last event in every book.
- `amount`: the round's final payout × 100 (equals the book's `payoutMultiplier`)
```json
{"index": 73, "type": "finalWin", "amount": 7510}
```

> `enterBonus` is not emitted by Vault Breakers. Bonus and super books start with a forced base `reveal` followed by `freeSpinTrigger`.

## Bet modes (RGS mode names)
- `base` (1×)
- `ante` (1.25×): base game on BR1 reels, ~1.2× the BR0 scatter count (85 vs 70), set by `ANTE_SCATTER_MULT` in `generate_reels.py`
- `bonus` (100× buy): 10 free spins
- `super` (400× buy): 10 free spins with every spot starting at x2 (`fsType` `super`; the `updateGrid` after `freeSpinTrigger` has every cell at 2) (free spins pay at the same scale as every other mode)

All modes target 96.2% RTP and cap wins at 10,000×.

## Event sequences (as seen in `math/samples/`)

**Base spin with a win** (`base_win_tumbles_multipliers.json`):
`reveal` → [`winInfo` → `updateTumbleWin` → `updateGrid` → `tumbleBoard`] × N → `setWin` → `setTotalWin` → `finalWin`

**A losing spin:** `reveal` → `setTotalWin` → `finalWin`

**Base spin that triggers free spins** (`base_fs_trigger.json`, `ante_fs_trigger.json`):
base spin events → `freeSpinTrigger` → `updateGrid` (start grid) → then for each spin: `updateFreeSpin` → `reveal` → `updateGrid` → [`winInfo` → `updateTumbleWin` → `updateGrid` → `tumbleBoard` → `vaultMeterUpdate` (→ `vaultMeterUpgrade` at 10/20/30)] × N → `setWin` (only if the spin won) → `setTotalWin` (→ `freeSpinRetrigger`) … → `freeSpinEnd` → `finalWin`

**Bonus buy** (`bonus_round.json`): a forced 3-scatter base `reveal` (which may itself pay with tumbles) → `setWin`/`setTotalWin` → `freeSpinTrigger` → free spins as above.

**Super buy** (`super_round.json`): the same as bonus, except `fsType` is `super` and the start `updateGrid` has every cell at `2`.

**Natural super / epic** (base and ante, 4 / 5+ scatters): the same flow with `fsType` `super` / `epic` and start grid 2 / 4. Epic rounds below 200x are redrawn on the math side, so books only ever contain the final round.

## Cluster pay
```
cluster_win = paytable_value × clusterMult × globalMult   (rounded to 0.1×)
clusterMult = sum of spot values under the cluster (unmarked 0, marked 1, then 2..128), or 1 if that sum is 0
```
`paytable_value` is the handoff value × 2.0 in every mode, in both the base game and free spins: free spins pay the base paytable (no FS pay boost). Extra FS value comes from the FR0 reels (more wilds) and spot multipliers.
