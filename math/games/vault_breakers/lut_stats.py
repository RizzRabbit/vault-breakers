"""Weighted stats from optimized publish LUTs: python3 lut_stats.py"""
import csv, os
HERE = os.path.dirname(os.path.abspath(__file__))
COST = {"base": 1, "ante": 1.25, "bonus": 100, "super": 400}
for m, cost in COST.items():
    lut = list(csv.reader(open(os.path.join(HERE, "library/publish_files", f"lookUpTable_{m}_0.csv"))))
    seg = {r[0]: r[1] for r in csv.reader(open(os.path.join(HERE, "library/lookup_tables", f"lookUpTableSegmented_{m}.csv")))}
    W = sum(int(r[1]) for r in lut)
    rtp = sum(int(r[1]) * int(r[2]) for r in lut) / 100 / W / cost
    hit = sum(int(r[1]) for r in lut if int(r[2]) > 0) / W
    fs = sum(int(r[1]) for r in lut if seg[r[0]] in ("freegame", "superfs", "epicfs", "wincap")) / W
    mx = max(int(r[2]) for r in lut if int(r[1]) > 0) / 100
    print(f"{m}: books={len(lut)} RTP={rtp*100:.3f}% hit 1 in {1/hit:.2f} FS 1 in {1/fs:.1f} max {mx:.1f}x")
