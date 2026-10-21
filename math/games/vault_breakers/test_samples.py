"""Quick test to generate sample books"""
import sys
import random
sys.path.insert(0, '/workspace/math')

from gamestate import GameState
from game_config import GameConfig
import json
import os

# Create config and gamestate
config = GameConfig()
gamestate = GameState(config)

print(f"Testing {config.working_name}...")
print(f"Target RTP: {config.rtp}")
print(f"Wincap: {config.wincap}x")
print()

# Create samples directory
os.makedirs('/workspace/math/samples', exist_ok=True)

# Generate a base game sample
print("Generating base mode sample...")
gamestate.betmode = "base"
gamestate.criteria = "basegame"
gamestate.sim = 0
random.seed(42)
gamestate.run_spin(0, simulation_seed=42)

# Save the book
base_book = {
    "betMode": "base",
    "cost": 100,
    "totalWin": round(gamestate.final_win * 100),
    "events": gamestate.book.events
}

with open('/workspace/math/samples/base_sample.json', 'w') as f:
    json.dump(base_book, f, indent=2)

print(f"✓ Base sample: {len(base_book['events'])} events, win: {base_book['totalWin']/100:.2f}x")

# Generate a bonus mode sample
print("Generating bonus mode sample...")
gamestate2 = GameState(config)  # Fresh gamestate
gamestate2.betmode = "bonus"
gamestate2.criteria = "freegame"
gamestate2.sim = 0
random.seed(43)
gamestate2.run_spin(0, simulation_seed=43)

bonus_book = {
    "betMode": "bonus",
    "cost": 10000,
    "totalWin": round(gamestate2.final_win * 100),
    "events": gamestate2.book.events
}

with open('/workspace/math/samples/bonus_sample.json', 'w') as f:
    json.dump(bonus_book, f, indent=2)

print(f"✓ Bonus sample: {len(bonus_book['events'])} events, win: {bonus_book['totalWin']/10000:.2f}x")

print("\n✓ Sample books generated successfully!")
