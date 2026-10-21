"""Quick simulation to get RTP and hit metrics"""
import sys
import random
sys.path.insert(0, '/workspace/math')

from gamestate import GameState
from game_config import GameConfig

config = GameConfig()

# Base mode simulation
print("Running base mode simulation (10,000 spins)...")
total_bet = 0
total_win = 0
hits = 0
fs_triggers = 0

for i in range(10000):
    gamestate = GameState(config)
    gamestate.betmode = "base"
    gamestate.criteria = "basegame" if i % 3 == 0 else "0"
    gamestate.sim = i
    random.seed(i)
    gamestate.run_spin(i, simulation_seed=i)
    
    total_bet += 1
    win = gamestate.final_win
    total_win += win
    if win > 0:
        hits += 1
    if gamestate.triggered_freegame:
        fs_triggers += 1
    
    if (i + 1) % 2500 == 0:
        print(f"  {i+1} spins completed...")

base_rtp = (total_win / total_bet) * 100 if total_bet > 0 else 0
base_hit_rate = total_bet / hits if hits > 0 else 0
base_fs_rate = total_bet / fs_triggers if fs_triggers > 0 else 0

print(f"\nBase Mode Results:")
print(f"  RTP: {base_rtp:.2f}%")
print(f"  Hit Rate: 1 in {base_hit_rate:.1f}")
print(f"  FS Trigger: 1 in {base_fs_rate:.1f}")

# Bonus mode simulation
print("\nRunning bonus mode simulation (1,000 buys)...")
total_bet_bonus = 0
total_win_bonus = 0
hits_bonus = 0

for i in range(1000):
    gamestate = GameState(config)
    gamestate.betmode = "bonus"
    gamestate.criteria = "freegame"
    gamestate.sim = i + 10000
    random.seed(i + 10000)
    gamestate.run_spin(i, simulation_seed=i + 10000)
    
    total_bet_bonus += 100  # Bonus costs 100x
    win = gamestate.final_win
    total_win_bonus += win
    if win > 0:
        hits_bonus += 1
    
    if (i + 1) % 250 == 0:
        print(f"  {i+1} buys completed...")

bonus_rtp = (total_win_bonus / total_bet_bonus) * 100 if total_bet_bonus > 0 else 0

print(f"\nBonus Mode Results:")
print(f"  RTP: {bonus_rtp:.2f}%")
print(f"  Hit Rate: {hits_bonus}/{1000} buys")

print(f"\n{'='*50}")
print("Summary:")
print(f"  Base: RTP {base_rtp:.2f}%, Hit 1/{base_hit_rate:.1f}, FS 1/{base_fs_rate:.1f}")
print(f"  Bonus: RTP {bonus_rtp:.2f}%")
print(f"{'='*50}")
