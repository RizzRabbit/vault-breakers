"""Audit published books against the Vault Breakers rules.
python3 audit_books.py [max_books_per_mode]   (run from games/vault_breakers)"""
import csv, io, json, os, sys
import zstandard

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, "library", "publish_files")
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else None
TIERS = [0, 1, 2, 4, 8, 16, 32, 64, 128]


def nxt(v):
    return TIERS[min(TIERS.index(v) + 1, len(TIERS) - 1)]


def audit(mode):
    lut = {int(r[0]): int(r[2]) for r in csv.reader(open(os.path.join(PUB, f"lookUpTable_{mode}_0.csv")))}
    err = {k: 0 for k in ["unique_upgrade", "scatter_in_cluster", "wild_only", "dup_explode", "after_wincap",
                          "payout_mod10", "final_mismatch", "lut_mismatch", "super_start", "meter"]}
    stats = {"books": 0, "shared_wild_tumbles": 0, "wincap_books": 0, "meter_upgrades": 0}
    with open(os.path.join(PUB, f"books_{mode}.jsonl.zst"), "rb") as fh:
        for line in io.TextIOWrapper(zstandard.ZstdDecompressor().stream_reader(fh)):
            b = json.loads(line)
            stats["books"] += 1
            if LIMIT and stats["books"] > LIMIT:
                break
            ev = b["events"]
            if b["payoutMultiplier"] % 10: err["payout_mod10"] += 1
            if ev[-1]["type"] != "finalWin" or ev[-1]["amount"] != b["payoutMultiplier"]: err["final_mismatch"] += 1
            if lut[b["id"]] != b["payoutMultiplier"]: err["lut_mismatch"] += 1
            grid = None; vis = None; capped = False; meter = 0; fs_started = False
            for i, e in enumerate(ev):
                t = e["type"]
                if capped and t in ("winInfo", "tumbleBoard", "updateFreeSpin", "freeSpinRetrigger", "freeSpinTrigger"):
                    err["after_wincap"] += 1
                if t == "wincap":
                    capped = True; stats["wincap_books"] += 1
                if t == "freeSpinTrigger":
                    meter = 0; fs_started = True
                    if mode == "super":
                        g = next(x for x in ev[i + 1:] if x["type"] == "updateGrid")["gridMultipliers"]
                        if any(v != 2 for r in g for v in r): err["super_start"] += 1
                if t == "reveal":
                    vis = [[s["name"] for s in r] for r in e["board"]]  # padded 7-row board
                    if e["gameType"] == "basegame": grid = [[0] * 5 for _ in range(5)]
                if t in ("updateGrid", "vaultMeterUpgrade") and grid is not None and t == "vaultMeterUpgrade":
                    grid = e["gridMultipliers"]
                if t == "updateGrid" and not any(x["type"] == "winInfo" for x in ev[max(0, i - 2):i]):
                    grid = e["gridMultipliers"]
                if t == "winInfo":
                    cells = []
                    for w in e["wins"]:
                        ps = [(p["reel"], p["row"] - 1) for p in w["positions"]]
                        names = [vis[r][c + 1] for r, c in ps]
                        if "S" in names: err["scatter_in_cluster"] += 1
                        if all(n == "W" for n in names): err["wild_only"] += 1
                        cells += ps
                    if len(cells) != len(set(cells)): stats["shared_wild_tumbles"] += 1
                    after = next((x for x in ev[i + 1:] if x["type"] == "updateGrid"), None)
                    if after and grid is not None:
                        a = after["gridMultipliers"]
                        for r, c in set(cells):
                            if a[r][c] != nxt(grid[r][c]): err["unique_upgrade"] += 1
                        grid = a
                if t == "tumbleBoard":
                    rm = {(p["reel"], p["row"] - 1) for p in e["explodingSymbols"]}
                    if len(rm) != len(e["explodingSymbols"]): err["dup_explode"] += 1
                    for r in range(5):
                        keep = [vis[r][c] for c in range(len(vis[r])) if (r, c - 1) not in rm]
                        vis[r] = [s["name"] for s in e["newSymbols"][r]] + keep
                if t == "vaultMeterUpdate":
                    meter += 1
                    if e["meter"] != meter: err["meter"] += 1
                if t == "vaultMeterUpgrade":
                    stats["meter_upgrades"] += 1
                    if e["meter"] not in (10, 20, 30): err["meter"] += 1
    return err, stats


if __name__ == "__main__":
    for m in ["base", "ante", "bonus", "super"]:
        err, st = audit(m)
        print(m, st, "ERRORS:" if any(err.values()) else "OK", {k: v for k, v in err.items() if v})
