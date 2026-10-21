"""Unbiased RTP measurement: python3 measure_natural.py <mode> <n> [threads]
Replaces the mode's distributions with a single unforced 'natural' criteria (bonus still forces FS entry)
and simulates in-process without writing books."""
import sys, time
from src.wins.win_manager import WinManager
from multiprocessing import Pool
from game_config import GameConfig
from gamestate import GameState
from src.config.distributions import Distribution

def work(args):
    mode, start, n = args
    cfg = GameConfig()
    for bm in cfg.bet_modes:
        if bm.get_name() == mode:
            buy = bm.get_buybonus() if hasattr(bm, "get_buybonus") else bm._is_buybonus
            cond = {"reel_weights": {cfg.basegame_type: {"BR1" if mode == "ante" else "BR0": 1}, cfg.freegame_type: {"FR0": 1}},
                    "force_wincap": False, "force_freegame": buy}
            if buy:
                cond["scatter_triggers"] = eval(__import__("os").environ.get("VB_ST", "{3: 1}"))
            bm._distributions = [Distribution(criteria="natural", quota=1.0, conditions=cond)]
    for attempt in range(20):
        try:
            gs = GameState(cfg); break
        except FileExistsError:
            time.sleep(0.2)
    gs.win_manager = WinManager(cfg.basegame_type, cfg.freegame_type, 10000)
    gs.betmode = mode
    tot = hits = trig = 0; mx = 0.0; base_w = fs_w = 0.0
    for sim in range(start, start + n):
        gs.criteria = "natural"
        gs.run_spin(sim)
        w = gs.final_win
        tot += w; hits += w > 0; mx = max(mx, w); trig += bool(gs.triggered_freegame)
        base_w += gs.book.basegame_wins; fs_w += gs.book.freegame_wins
    return tot, hits, trig, mx, base_w, fs_w

if __name__ == "__main__":
    mode, n = sys.argv[1], int(sys.argv[2]); th = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    chunk = n // th
    with Pool(th) as p:
        res = p.map(work, [(mode, 1 + i * chunk, chunk) for i in range(th)])
    N = chunk * th; cost = {bm.get_name(): bm.get_cost() for bm in GameConfig().bet_modes}[mode]
    tot, hits, trig, mx, bw, fw = [sum(r[i] for r in res) if i != 3 else max(r[3] for r in res) for i in range(6)]
    print(f"{mode} N={N} RTP={tot/N/cost*100:.2f}% (base {bw/N/cost*100:.2f}% / fs {fw/N/cost*100:.2f}%) "
          f"hit 1 in {N/max(hits,1):.2f} fs 1 in {N/max(trig,1):.1f} max {mx:.1f}x")
