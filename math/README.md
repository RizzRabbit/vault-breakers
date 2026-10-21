# Vault Breakers Math Backend

This directory contains the mathematical model and simulation backend for the Vault Breakers slot game, built on the StakeEngine math-sdk framework.

## Game Overview

**Vault Breakers** is a 5×5 cluster-pays slot with cascading wins and spot multipliers.

### Core Mechanics
- **Grid**: 5×5 symbol grid
- **Win Type**: Cluster pays (5+ orthogonally adjacent matching symbols)
- **Tumbles**: Winning symbols are removed; new symbols fall to fill gaps
- **Spot Multipliers**: 
  - First win on a position marks it (1×)
  - Each subsequent win on that position doubles the multiplier (2×, 4×, 8×, 16×, 32×, 64×, 128×)
  - Maximum multiplier: 128×
  - Reset every base game spin
  - Persist throughout entire free spin round
- **Cluster Pay Formula**: base_pay × sum_of_spot_multipliers_in_cluster

### Symbols
- **High Symbols**: H1 (Gold Bar), H2 (Diamond), H3 (Ruby), H4 (Emerald)
- **Low Symbols**: L1 (A), L2 (K), L3 (Q), L4 (J)
- **Wild (W)**: Substitutes for all symbols except Scatter
- **Scatter (S)**: Vault symbol, triggers free spins

### Free Spins
- **Base Game**: 3 scatters = regular FS (unmarked), 4 = SUPER FS (all spots x2), 5+ = EPIC FS (all spots x4, round pays >= 200x); every tier is 10 free spins, retrigger (3+ scatters) +5 in the same tier
- **During Free Spins**: 3+ Scatters = +5 additional spins

### Bet Modes
RGS mode names (exact, lowercase): `base`, `ante`, `bonus`, `super`.

| Mode | Cost | Description |
|---|---|---|
| `base` | 1× | Standard play (reels BR0) |
| `ante` | 1.25× | Base game on reels BR1 (~1.2× BR0 scatter count, 85 vs 70); FS ~1 in 140 |
| `bonus` | 100× | Buy: starts directly in 10 free spins |
| `super` | 400× | Buy: the SUPER round (10 free spins, every spot starts at x2; FS pays the base paytable). Epic is not buyable |

All four modes target 96.2% RTP with a 10,000× win cap.

### Target Metrics
- **RTP**: 96.2% in all four modes (base, ante, bonus, super)
- **Wincap**: 10,000× bet
- **Base Hit Rate**: ~1/3.5 spins (optimized: 1 in 3.44)
- **Free Spin Trigger Rate**: ~1/200 spins

## Directory Structure

```
math/
├── design/               # Design documents
│   ├── handoff.json     # Paytable and symbol weights from math designer
│   └── sim.py           # Reference simulator
├── samples/             # Sample book outputs (generated)
│   ├── base_win_tumbles_multipliers.json
│   ├── base_fs_trigger.json
│   ├── ante_fs_trigger.json
│   ├── bonus_round.json
│   └── super_round.json
├── reels/               # Reel strip files
│   ├── BR0.csv         # Base game reels
│   └── FR0.csv         # Free spin reels
├── src/                 # StakeEngine SDK core
├── optimization_program/ # Optimization algorithm
├── utils/               # Utilities and analysis tools
├── game_config.py       # Game configuration and paytable
├── gamestate.py         # Game state machine
├── game_executables.py  # Executable game functions
├── game_calculations.py # Win calculation logic
├── game_events.py       # Event definitions
├── game_override.py     # State overrides
├── game_optimization.py # Optimization parameters
├── run.py              # Main simulation runner
├── prototype_sim.py    # Original designer simulator
├── EVENTS.md           # Event type documentation
└── README.md           # This file
```

## Setup

### Prerequisites
- Python 3.12 or higher
- pip package manager

### Installation

1. Create and activate a virtual environment:
```bash
cd math/
python3 -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
```

2. Install dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

3. Install the SDK in development mode:
```bash
pip install -e .
```

## Running Simulations

### Basic Simulation
Run the main simulation to generate books and statistics:

```bash
python run.py
```

This will:
- Generate the spins/buys configured in `num_sim_args` for each mode
- Output simulation books to the `books/` directory
- Create analysis spreadsheets in the `spreadsheets/` directory
- Generate RTP, hit rate, and other metrics

### Quick Test
For a quick test with fewer spins, edit the `num_sim_args` in `run.py`:

```python
num_sim_args = {
    "base": int(1e4),    # 10k spins
    "ante": int(1e4),    # 10k spins
    "bonus": int(1e3),   # 1k buys
    "super": int(1e3),   # 1k buys
}
```

The released tables were produced with `games/vault_breakers/run_local.py`
(`python3 run_local.py 80000 16000 1 0 80000 8000` for books, then
`python3 run_local.py 0 0 0 1` for the optimizer; `VB_MODES=bonus,super` limits modes).
`lut_stats.py` prints RTP / hit rate / FS rate / max win per mode from the published tables.

### Running the Optimizer
To run the SDK optimizer (requires Rust/Cargo):

1. Ensure Rust is installed: https://rustup.rs/
2. Enable optimization in `run.py`:
```python
run_conditions = {
    "run_sims": True,
    "run_optimization": True,  # Enable this
    "run_analysis": True,
    "run_format_checks": True,
}
```
3. Run: `python run.py`

The optimizer reweights the simulated books to hit 96.2% RTP in every mode.

## Pay Scales

Base game and free spins use the same pay scale:

- **Base Game** (all modes): 2.0× multiplier on paytable values
- **Free Spins**: 2.0× in every mode, the same base paytable (no FS pay boost; FS value comes from richer FR0 reels and spot multipliers)

These scales are applied in `game_config.py` when constructing the paytable from the base values in `design/handoff.json`.

## Output Files

After running simulations, you'll find:

- `books/` - Compressed simulation books (event logs for each spin)
- `spreadsheets/` - Excel files with detailed statistics
- `lookup_tables/` - JSON files with game state lookups
- `configs/` - Generated configuration files

## Design Documents

### handoff.json
Contains the official paytable, symbol weights, and game parameters from the math designer. This is the source of truth for all numerical values.

### sim.py / prototype_sim.py
The reference simulator provided by the math designer. Useful for validating the SDK implementation produces equivalent results.

## Testing

Run the format and verification tests:

```bash
python run.py  # Tests run automatically at the end
```

Or run pytest if available:

```bash
pytest
```

## Events Documentation

See `EVENTS.md` for complete documentation of all book event types generated by the simulation.

## Notes

- Symbol weights in `design/handoff.json` are preliminary and will be optimized
- The optimizer targets 96.2% RTP for all four modes (base, ante, bonus, super), 10,000× cap
- Books are compressed by default for efficiency; set `compression = False` in `run.py` to generate readable JSON

## Support

For questions about the StakeEngine SDK, see: https://engineio.github.io/math-sdk/
