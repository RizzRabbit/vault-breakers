# Vault Breakers Event Types

This document describes all event types generated in the simulation books for Vault Breakers. Each event represents a state change or action during game play.

## Event Structure

All events share a common structure:
```json
{
  "index": 0,
  "type": "eventType",
  ...additional fields...
}
```

- `index`: Sequential event number within the book
- `type`: Event type identifier (see below)

## Event Types

### 1. reveal

**Description**: Initial board drawn from reel strips at the start of a spin or tumble.

**When**: 
- Start of each base game spin
- Start of each free spin
- After symbols tumble and new symbols fill in

**Fields**:
- `index`: Event sequence number
- `type`: "reveal"
- `board`: 2D array of symbols (5 reels × 5 rows for base grid, plus padding if enabled)
  - Each symbol has `name` (e.g., "H1", "L2", "W", "S")
  - Special symbols may have additional flags (e.g., `"wild": true`, `"scatter": true`)
- `paddingPositions`: Array of reel positions used for draw
- `gameType`: "basegame" or "freegame"
- `anticipation`: Boolean indicating near-miss for free spins

**Example**:
```json
{
  "index": 0,
  "type": "reveal",
  "board": [
    [{"name": "L4"}, {"name": "L3"}, {"name": "H2"}, {"name": "L1"}, {"name": "H3"}, {"name": "L2"}, {"name": "L4"}],
    [{"name": "L2"}, {"name": "H4"}, {"name": "L1"}, {"name": "L3"}, {"name": "H1"}, {"name": "L4"}, {"name": "L3"}],
    [{"name": "H3"}, {"name": "L1"}, {"name": "L4"}, {"name": "L2"}, {"name": "H4"}, {"name": "L3"}, {"name": "L1"}],
    [{"name": "L3"}, {"name": "L4"}, {"name": "H1"}, {"name": "L1"}, {"name": "L2"}, {"name": "H2"}, {"name": "L4"}],
    [{"name": "L1"}, {"name": "L4"}, {"name": "L3"}, {"name": "H3"}, {"name": "L2"}, {"name": "H4"}, {"name": "L1"}]
  ],
  "paddingPositions": [45, 67, 23, 89, 12],
  "gameType": "basegame",
  "anticipation": false
}
```

---

### 2. winInfo

**Description**: Details of all wins (clusters) found on the current board.

**When**: After reveal, when clusters of 5+ matching symbols are detected

**Fields**:
- `index`: Event sequence number
- `type`: "winInfo"
- `wins`: Array of win objects, each containing:
  - `symbol`: Symbol name that formed the cluster
  - `clusterSize`: Number of symbols in the cluster
  - `win`: Total win amount (in cents/units × 100)
  - `positions`: Array of `{reel, row}` objects showing cluster positions
  - `meta`: Metadata object with:
    - `globalMult`: Global multiplier (typically 1)
    - `clusterMult`: Sum of spot multipliers for this cluster
    - `winWithoutMult`: Base paytable value before multipliers
    - `overlay`: Central position for visual overlay `{reel, row}`

**Example**:
```json
{
  "index": 1,
  "type": "winInfo",
  "wins": [
    {
      "symbol": "L3",
      "clusterSize": 6,
      "win": 140,
      "positions": [
        {"reel": 0, "row": 1},
        {"reel": 0, "row": 2},
        {"reel": 1, "row": 1},
        {"reel": 1, "row": 2},
        {"reel": 2, "row": 1},
        {"reel": 2, "row": 2}
      ],
      "meta": {
        "globalMult": 1,
        "clusterMult": 2,
        "winWithoutMult": 70,
        "overlay": {"reel": 1, "row": 1}
      }
    }
  ]
}
```

---

### 3. updateGrid

**Description**: Current state of spot multipliers after wins are evaluated.

**When**: After wins are processed and spot multipliers are updated

**Fields**:
- `index`: Event sequence number
- `type`: "updateGrid"
- `gridMultipliers`: 5×5 array of multiplier values at each position
  - `0`: Unmarked (no wins yet)
  - `1`: Marked (first win)
  - `2, 4, 8, 16, 32, 64, 128`: Doubled after each subsequent win

**Example**:
```json
{
  "index": 2,
  "type": "updateGrid",
  "gridMultipliers": [
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
}
```

---

### 4. setTumbleWin

**Description**: Sets the win amount for the current tumble.

**When**: After all clusters in a tumble are evaluated

**Fields**:
- `index`: Event sequence number
- `type`: "setTumbleWin"
- `amount`: Win amount for this tumble (in cents × 100)

**Example**:
```json
{
  "index": 3,
  "type": "setTumbleWin",
  "amount": 140
}
```

---

### 5. tumbleBoard

**Description**: Symbols are removed and new symbols fall to fill gaps.

**When**: After wins are evaluated, before the next reveal

**Fields**:
- `index`: Event sequence number
- `type`: "tumbleBoard"

**Example**:
```json
{
  "index": 4,
  "type": "tumbleBoard"
}
```

---

### 6. setWin

**Description**: Updates the cumulative win for the current spin (base or FS).

**When**: After each tumble sequence completes

**Fields**:
- `index`: Event sequence number
- `type`: "setWin"
- `amount`: Cumulative win for this spin (in cents × 100)
- `winLevel`: Win tier classification (e.g., "small", "medium", "big", "mega")

**Example**:
```json
{
  "index": 8,
  "type": "setWin",
  "amount": 450,
  "winLevel": "medium"
}
```

---

### 7. freeSpinTrigger

**Description**: Free spins are triggered from the base game.

**When**: When 3+ scatter symbols land in base game

**Fields**:
- `index`: Event sequence number
- `type`: "freeSpinTrigger"
- `totalFs`: Total number of free spins awarded
- `positions`: Array of scatter positions `{reel, row}` that triggered FS

**Example**:
```json
{
  "index": 9,
  "type": "freeSpinTrigger",
  "totalFs": 10,
  "positions": [
    {"reel": 0, "row": 3},
    {"reel": 2, "row": 1},
    {"reel": 4, "row": 4}
  ]
}
```

---

### 8. updateFreeSpin

**Description**: Updates the free spin counter at the start of each FS.

**When**: Beginning of each free spin

**Fields**:
- `index`: Event sequence number
- `type`: "updateFreeSpin"
- `currentFs`: Current free spin number (1-indexed)
- `totalFs`: Total free spins in the round

**Example**:
```json
{
  "index": 10,
  "type": "updateFreeSpin",
  "currentFs": 1,
  "totalFs": 10
}
```

---

### 9. freeSpinRetrigger

**Description**: Additional free spins awarded during free spin round.

**When**: When 3+ scatters land during a free spin

**Fields**:
- `index`: Event sequence number
- `type`: "freeSpinRetrigger"
- `totalFs`: New total number of free spins (after adding +5)
- `positions`: Array of scatter positions that triggered retrigger

**Example**:
```json
{
  "index": 45,
  "type": "freeSpinRetrigger",
  "totalFs": 15,
  "positions": [
    {"reel": 1, "row": 2},
    {"reel": 3, "row": 3},
    {"reel": 4, "row": 1}
  ]
}
```

---

### 10. freeSpinEnd

**Description**: Free spin round has ended.

**When**: After all free spins are complete

**Fields**:
- `index`: Event sequence number
- `type`: "freeSpinEnd"
- `totalWin`: Total win from the entire FS round (in cents × 100)

**Example**:
```json
{
  "index": 120,
  "type": "freeSpinEnd",
  "totalWin": 5430
}
```

---

### 11. setTotalWin

**Description**: Sets the final total win for the entire game round.

**When**: After all base and feature game play completes

**Fields**:
- `index`: Event sequence number
- `type`: "setTotalWin"
- `amount`: Final total win (in cents × 100)

**Example**:
```json
{
  "index": 121,
  "type": "setTotalWin",
  "amount": 6200
}
```

---

### 12. finalWin

**Description**: Final summary of the game round.

**When**: Last event in every book

**Fields**:
- `index`: Event sequence number
- `type`: "finalWin"
- `amount`: Final win amount (in cents × 100)
- `winLevel`: Overall win tier

**Example**:
```json
{
  "index": 122,
  "type": "finalWin",
  "amount": 6200,
  "winLevel": "big"
}
```

---

### 13. wincap

**Description**: Maximum win cap has been triggered.

**When**: When total win reaches or exceeds 10,000× bet

**Fields**:
- `index`: Event sequence number
- `type`: "wincap"
- `amount`: Capped win amount (1,000,000 for 10,000× on 1× bet)

**Example**:
```json
{
  "index": 78,
  "type": "wincap",
  "amount": 1000000
}
```

---

### 14. enterBonus

**Description**: Player entered bonus buy mode.

**When**: Start of a bonus buy round (100× bet)

**Fields**:
- `index`: Event sequence number
- `type`: "enterBonus"
- `cost`: Bonus buy cost (in cents × 100)

**Example**:
```json
{
  "index": 0,
  "type": "enterBonus",
  "cost": 10000
}
```

---

### 15. vaultMeterUpdate
Free spins only. Emitted after every tumble in free spins; the Vault Meter goes up by 1 and keeps its value for the whole round, retriggers included.
```json
{"index": 42, "type": "vaultMeterUpdate", "meter": 7, "nextThreshold": 10}
```
- `meter`: the meter value after this tumble
- `nextThreshold`: the next upgrade point (10, 20 or 30), or `null` once 30 has passed

### 16. vaultMeterUpgrade
Free spins only. Emitted right after the `vaultMeterUpdate` that reaches 10, 20 or 30. One random marked spot (one that is below x128) moves up one tier: marked becomes x2, x2 becomes x4, and so on, capped at x128. If no spot qualifies, a random unmarked spot becomes x2.
```json
{"index": 91, "type": "vaultMeterUpgrade", "meter": 10,
 "position": {"reel": 2, "row": 1}, "oldMultiplier": 64, "newMultiplier": 128,
 "gridMultipliers": [[0,1,2,0,0], ...]}
```
- `oldMultiplier`: 0 means unmarked and 1 means marked but with no multiplier yet
- `gridMultipliers`: the full grid after the upgrade, in the same layout as `updateGrid`

### Bet modes
`base` (1x), `ante` (1.25x, base game on BR1 reels with ~1.2x the BR0 scatter count (85 vs 70), set by `ANTE_SCATTER_MULT` in `generate_reels.py`), `bonus` (100x buy, 10 free spins), and `super` (400x buy, 10 free spins). In `super`, an `updateGrid` event with every spot at 2 is emitted at the start of free spins.

## Event Sequences

### Typical Base Game Win (No FS)
1. `reveal` - Initial board
2. `winInfo` - Clusters found
3. `updateGrid` - Spot multipliers updated
4. `setTumbleWin` - Tumble win amount
5. `tumbleBoard` - Symbols removed
6. `reveal` - New symbols fall
7. (Repeat 2-6 until no more wins)
8. `setWin` - Final spin win
9. `setTotalWin` - Total win
10. `finalWin` - Summary

### Base Game with Free Spin Trigger
1-8. (Base game events as above)
9. `freeSpinTrigger` - FS triggered
10. `updateFreeSpin` - FS 1 of N
11. `updateGrid` - Multipliers initialized
12. `reveal` - FS board
13. `winInfo` - FS wins
14. `updateGrid` - Multipliers updated
15. `setTumbleWin` - FS tumble win
16. (Tumbles continue...)
17. `setWin` - FS spin total
18. (Repeat 10-17 for each FS)
19. `freeSpinEnd` - FS round complete
20. `setTotalWin` - Grand total
21. `finalWin` - Summary

### Bonus Buy
1. `enterBonus` - Bonus activated
2. `updateFreeSpin` - FS 1 of N
3. `updateGrid` - Multipliers initialized
4. (FS events continue as above)

---

## Notes

### Amounts
All win amounts in events are in **cents × 100** (or units × 100). For example:
- `amount: 250` = 2.50 bet units = 2.5× win

### Win Levels
Typical win level thresholds:
- `"no_win"`: 0×
- `"small"`: 1-10×
- `"medium"`: 10-50×
- `"big"`: 50-200×
- `"mega"`: 200-1000×
- `"super"`: 1000-5000×
- `"ultra"`: 5000+×

### Spot Multiplier Progression
- **Unmarked**: `0` (no wins yet on this spot)
- **First win**: `1` (spot is marked)
- **Subsequent wins**: Doubled each time (2, 4, 8, 16, 32, 64, 128)

### Cluster Pay Calculation
```
cluster_pay = base_paytable_value × sum_of_spot_multipliers × global_multiplier
```

Where:
- `base_paytable_value`: From paytable (already scaled 2.0× for base, 3.25× for FS)
- `sum_of_spot_multipliers`: Sum of all multiplier values in the cluster
- `global_multiplier`: Typically 1 (for future features)
