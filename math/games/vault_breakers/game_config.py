"""Vault Breakers game configuration file"""

import os
from src.config.config import Config
from src.config.distributions import Distribution
from src.config.betmode import BetMode


class GameConfig(Config):
    """Vault Breakers cluster game configuration class."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        super().__init__()
        self.game_id = "vault_breakers"
        self.provider_number = 0
        self.working_name = "Vault Breakers"
        self.wincap = 10000.0
        self.win_type = "cluster"
        self.rtp = 0.962
        self.construct_paths()

        # Game Dimensions: 5x5 grid
        self.num_reels = 5
        self.num_rows = [5] * self.num_reels

        # Paytable from handoff.json
        # Cluster size buckets: 5, 6, 7, 8, 9-10, 11-12, 13-15, 16+
        # Base pay scale: 2.0, Freespin pay scale: 3.25
        pay_group = {
            # H1 - Gold Bar
            ((5, 5), "H1"): 1.5 * 2.0,
            ((6, 6), "H1"): 2 * 2.0,
            ((7, 7), "H1"): 3 * 2.0,
            ((8, 8), "H1"): 5 * 2.0,
            ((9, 10), "H1"): 10 * 2.0,
            ((11, 12), "H1"): 25 * 2.0,
            ((13, 15), "H1"): 60 * 2.0,
            ((16, 25), "H1"): 150 * 2.0,
            # H2 - Diamond
            ((5, 5), "H2"): 1 * 2.0,
            ((6, 6), "H2"): 1.5 * 2.0,
            ((7, 7), "H2"): 2.5 * 2.0,
            ((8, 8), "H2"): 4 * 2.0,
            ((9, 10), "H2"): 8 * 2.0,
            ((11, 12), "H2"): 18 * 2.0,
            ((13, 15), "H2"): 45 * 2.0,
            ((16, 25), "H2"): 100 * 2.0,
            # H3 - Ruby
            ((5, 5), "H3"): 0.8 * 2.0,
            ((6, 6), "H3"): 1.2 * 2.0,
            ((7, 7), "H3"): 2 * 2.0,
            ((8, 8), "H3"): 3 * 2.0,
            ((9, 10), "H3"): 6 * 2.0,
            ((11, 12), "H3"): 14 * 2.0,
            ((13, 15), "H3"): 35 * 2.0,
            ((16, 25), "H3"): 80 * 2.0,
            # H4 - Emerald
            ((5, 5), "H4"): 0.6 * 2.0,
            ((6, 6), "H4"): 1 * 2.0,
            ((7, 7), "H4"): 1.5 * 2.0,
            ((8, 8), "H4"): 2.5 * 2.0,
            ((9, 10), "H4"): 5 * 2.0,
            ((11, 12), "H4"): 10 * 2.0,
            ((13, 15), "H4"): 25 * 2.0,
            ((16, 25), "H4"): 60 * 2.0,
            # L1 - A
            ((5, 5), "L1"): 0.4 * 2.0,
            ((6, 6), "L1"): 0.5 * 2.0,
            ((7, 7), "L1"): 0.8 * 2.0,
            ((8, 8), "L1"): 1.2 * 2.0,
            ((9, 10), "L1"): 2 * 2.0,
            ((11, 12), "L1"): 5 * 2.0,
            ((13, 15), "L1"): 12 * 2.0,
            ((16, 25), "L1"): 30 * 2.0,
            # L2 - K
            ((5, 5), "L2"): 0.3 * 2.0,
            ((6, 6), "L2"): 0.4 * 2.0,
            ((7, 7), "L2"): 0.6 * 2.0,
            ((8, 8), "L2"): 1 * 2.0,
            ((9, 10), "L2"): 1.6 * 2.0,
            ((11, 12), "L2"): 4 * 2.0,
            ((13, 15), "L2"): 10 * 2.0,
            ((16, 25), "L2"): 25 * 2.0,
            # L3 - Q
            ((5, 5), "L3"): 0.25 * 2.0,
            ((6, 6), "L3"): 0.35 * 2.0,
            ((7, 7), "L3"): 0.5 * 2.0,
            ((8, 8), "L3"): 0.8 * 2.0,
            ((9, 10), "L3"): 1.3 * 2.0,
            ((11, 12), "L3"): 3 * 2.0,
            ((13, 15), "L3"): 8 * 2.0,
            ((16, 25), "L3"): 20 * 2.0,
            # L4 - J
            ((5, 5), "L4"): 0.2 * 2.0,
            ((6, 6), "L4"): 0.3 * 2.0,
            ((7, 7), "L4"): 0.4 * 2.0,
            ((8, 8), "L4"): 0.6 * 2.0,
            ((9, 10), "L4"): 1 * 2.0,
            ((11, 12), "L4"): 2.5 * 2.0,
            ((13, 15), "L4"): 6 * 2.0,
            ((16, 25), "L4"): 15 * 2.0,
        }
        self.paytable = self.convert_range_table(pay_group)
        # Paytable above is at base pay scale 2.0; free spins pay at scale 3.25
        self.base_pay_scale = 2.0
        self.freegame_pay_scale = 3.25
        self.freegame_pay_ratio = self.freegame_pay_scale / self.base_pay_scale

        self.include_padding = True
        self.special_symbols = {"wild": ["W"], "scatter": ["S"]}

        # Freespin triggers
        # Base: 3/4/5+ scatters = 10/12/15 spins
        # FS: 3+ = +5 spins
        self.freespin_triggers = {
            # 5+ scatters (incl. scatters landing during tumbles) all award 15 / +5
            self.basegame_type: {3: 10, 4: 12, **{n: 15 for n in range(5, 26)}},
            self.freegame_type: {n: 5 for n in range(3, 26)},
        }
        self.anticipation_triggers = {
            self.basegame_type: min(self.freespin_triggers[self.basegame_type].keys()) - 1,
            self.freegame_type: min(self.freespin_triggers[self.freegame_type].keys()) - 1,
        }

        # Spot multiplier cap: x128
        # Doubling progression: x1 -> x2 -> x4 -> x8 -> x16 -> x32 -> x64 -> x128
        self.maximum_board_mult = 128

        # Reels
        reels = {"BR0": "BR0.csv", "FR0": "FR0.csv"}
        self.reels = {}
        for r, f in reels.items():
            self.reels[r] = self.read_reels_csv(os.path.join(self.reels_path, f))

        mode_maxwins = {"base": 10000, "bonus": 10000}

        self.bet_modes = [
            BetMode(
                name="base",
                cost=1.0,
                rtp=self.rtp,
                max_win=mode_maxwins["base"],
                auto_close_disabled=False,
                is_feature=True,
                is_buybonus=False,
                distributions=[
                    Distribution(
                        criteria="wincap",
                        quota=0.001,
                        win_criteria=mode_maxwins["base"],
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BR0": 1},
                                self.freegame_type: {"FR0": 1},
                            },
                            "scatter_triggers": {3: 1, 4: 1, 5: 1},
                            "force_wincap": True,
                            "force_freegame": True,
                        },
                    ),
                    Distribution(
                        criteria="freegame",
                        quota=0.1,
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BR0": 1},
                                self.freegame_type: {"FR0": 1},
                            },
                            "scatter_triggers": {3: 5, 4: 3, 5: 1},
                            "force_wincap": False,
                            "force_freegame": True,
                        },
                    ),
                    Distribution(
                        criteria="0",
                        quota=0.4,
                        win_criteria=0.0,
                        conditions={
                            "reel_weights": {self.basegame_type: {"BR0": 1}},
                            "force_wincap": False,
                            "force_freegame": False,
                        },
                    ),
                    Distribution(
                        criteria="basegame",
                        quota=0.499,
                        conditions={
                            "reel_weights": {self.basegame_type: {"BR0": 1}},
                            "force_wincap": False,
                            "force_freegame": False,
                        },
                    ),
                ],
            ),
            BetMode(
                name="bonus",
                cost=100,
                rtp=self.rtp,
                max_win=mode_maxwins["bonus"],
                auto_close_disabled=False,
                is_feature=True,
                is_buybonus=True,
                distributions=[
                    Distribution(
                        criteria="wincap",
                        quota=0.001,
                        win_criteria=mode_maxwins["bonus"],
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BR0": 1},
                                self.freegame_type: {"FR0": 1},
                            },
                            "scatter_triggers": {3: 1},
                            "force_wincap": True,
                            "force_freegame": True,
                        },
                    ),
                    Distribution(
                        criteria="freegame",
                        quota=0.999,
                        conditions={
                            "reel_weights": {
                                self.basegame_type: {"BR0": 1},
                                self.freegame_type: {"FR0": 1},
                            },
                            "scatter_triggers": {3: 1},  # bonus buy awards 10 FS (3-scatter entry), as in prototype_sim.py
                            "force_wincap": False,
                            "force_freegame": True,
                        },
                    ),
                ],
            ),
        ]
