"""Local driver: python3 run_local.py <base_n> <bonus_n> <sims 0/1> <opt 0/1>"""
import sys
from gamestate import GameState
from game_config import GameConfig
from game_optimization import OptimizationSetup
from optimization_program.run_script import OptimizationExecution
from utils.game_analytics.run_analysis import create_stat_sheet
from utils.rgs_verification import execute_all_tests
from src.state.run_sims import create_books
from src.write_data.write_configs import generate_configs

if __name__ == "__main__":
    nb, nf, do_sims, do_opt = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3] == "1", sys.argv[4] == "1"
    na = int(sys.argv[5]) if len(sys.argv) > 5 else nb
    ns = int(sys.argv[6]) if len(sys.argv) > 6 else nf
    import os
    modes = os.environ.get("VB_MODES", "base,ante,bonus,super").split(",")
    config = GameConfig()
    gamestate = GameState(config)
    OptimizationSetup(config)
    if do_sims:
        create_books(gamestate, config, {"base": nb, "ante": na, "bonus": nf, "super": ns}, 10000, 8, True, False)
    generate_configs(gamestate)
    if do_opt:
        OptimizationExecution().run_all_modes(config, modes, 8)
        generate_configs(gamestate)
        execute_all_tests(config)
