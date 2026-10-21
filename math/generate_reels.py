"""Generate reel strips BR0/FR0 from design/handoff.json symbol weights.

Uses largest-remainder apportionment on long strips (1000 stops per reel) so symbol
frequencies match the handoff weights (and math/prototype_sim.py) closely.
Run from math/:  python3 generate_reels.py
"""

import json
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
REEL_DIR = os.path.join(HERE, "games", "vault_breakers", "reels")
REEL_LEN = 1000
NUM_REELS = 5

with open(os.path.join(HERE, "design", "handoff.json"), "r", encoding="utf-8") as f:
    handoff = json.load(f)


def apportion(weights, n):
    tot = sum(weights.values())
    raw = {s: w / tot * n for s, w in weights.items()}
    cnt = {s: int(v) for s, v in raw.items()}
    for s in sorted(raw, key=lambda s: raw[s] - cnt[s], reverse=True)[: n - sum(cnt.values())]:
        cnt[s] += 1
    return cnt


def strip(weights, rng):
    syms = [s for s, c in apportion(weights, REEL_LEN).items() for _ in range(c)]
    rng.shuffle(syms)
    return syms


def write(name, weights, seed):
    rng = random.Random(seed)
    reels = [strip(weights, rng) for _ in range(NUM_REELS)]
    with open(os.path.join(REEL_DIR, name), "w", encoding="utf-8") as f:
        for i in range(REEL_LEN):
            f.write(",".join(r[i] for r in reels) + "\n")
    print(name, apportion(weights, REEL_LEN))


if __name__ == "__main__":
    write("BR0.csv", handoff["base_symbol_weights"], 42)
    write("FR0.csv", handoff["freespin_symbol_weights"], 43)
