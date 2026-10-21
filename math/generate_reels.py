"""Generate reel strips from handoff.json weights"""

import random
import json

# Load handoff data
with open('/workspace/math/design/handoff.json', 'r') as f:
    handoff = json.load(f)

# Symbol weights from handoff
base_weights = handoff['base_symbol_weights']
fs_weights = handoff['freespin_symbol_weights']

# 5x5 grid, generate reel strips
# Each reel needs enough symbols for good distribution
# Target ~100-150 symbols per reel for good variance

def generate_reel_strip(weights, reel_length=120):
    """Generate a reel strip based on symbol weights."""
    symbols = []
    total_weight = sum(weights.values())
    
    # Calculate how many of each symbol
    for symbol, weight in weights.items():
        count = int((weight / total_weight) * reel_length)
        symbols.extend([symbol] * count)
    
    # Pad to exact length if needed
    while len(symbols) < reel_length:
        # Add most common symbol
        max_sym = max(base_weights.keys(), key=lambda k: base_weights[k])
        symbols.append(max_sym)
    
    # Shuffle for randomness
    random.shuffle(symbols)
    return symbols

# Generate base game reels (BR0.csv)
print("Generating BR0.csv (base game reels)...")
random.seed(42)
base_reels = []
for reel_idx in range(5):
    reel = generate_reel_strip(base_weights, 120)
    base_reels.append(reel)

# Write BR0.csv
with open('/workspace/math/reels/BR0.csv', 'w') as f:
    for row_idx in range(120):
        row = [base_reels[reel_idx][row_idx] for reel_idx in range(5)]
        f.write(','.join(row) + '\n')

print(f"BR0.csv: 5 reels × 120 rows")

# Generate freespin reels (FR0.csv)
print("Generating FR0.csv (freespin reels)...")
random.seed(43)
fs_reels = []
for reel_idx in range(5):
    reel = generate_reel_strip(fs_weights, 120)
    fs_reels.append(reel)

# Write FR0.csv
with open('/workspace/math/reels/FR0.csv', 'w') as f:
    for row_idx in range(120):
        row = [fs_reels[reel_idx][row_idx] for reel_idx in range(5)]
        f.write(','.join(row) + '\n')

print(f"FR0.csv: 5 reels × 120 rows")

# Print symbol distribution
print("\nBase game symbol distribution:")
for sym in sorted(base_weights.keys()):
    count = sum(reel.count(sym) for reel in base_reels)
    print(f"  {sym}: {count} ({count/600*100:.1f}%)")

print("\nFreespin symbol distribution:")
for sym in sorted(fs_weights.keys()):
    count = sum(reel.count(sym) for reel in fs_reels)
    print(f"  {sym}: {count} ({count/600*100:.1f}%)")

print("\nReels generated successfully!")
