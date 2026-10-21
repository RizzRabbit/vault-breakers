"""Vault Breakers optimization setup"""

from optimization_program.optimization_config import (
    ConstructScaling,
    ConstructParameters,
    ConstructFenceBias,
    ConstructConditions,
    verify_optimization_input,
)


class OptimizationSetup:
    """Optimization parameters for Vault Breakers."""

    def __init__(self, game_config):
        self.game_config = game_config
        wincaps = {}
        for bm in game_config.bet_modes:
            wincaps[bm.get_name()] = bm.get_wincap()
        
        self.game_config.opt_params = {
            "base": {
                "conditions": {
                    "wincap": ConstructConditions(
                        rtp=0.01, av_win=wincaps["base"], search_conditions=wincaps["base"]
                    ).return_dict(),
                    "0": ConstructConditions(rtp=0, av_win=0, search_conditions=0).return_dict(),
                    # Tier hit rates from BR0 scatter counts: 1/213 + 1/3420 + 1/86000 = 1 in 200 total FS.
                    "freegame": ConstructConditions(
                        rtp=0.40, hr=213, search_conditions={"fstype": "regular"}
                    ).return_dict(),
                    "superfs": ConstructConditions(
                        rtp=0.105, hr=3420, search_conditions={"fstype": "super"}
                    ).return_dict(),
                    "epicfs": ConstructConditions(
                        rtp=0.0104, hr=86000, search_conditions={"fstype": "epic"}
                    ).return_dict(),
                    "basegame": ConstructConditions(hr=3.5, rtp=0.4366).return_dict(),
                },
                "scaling": ConstructScaling(
                    [
                        {"criteria": "basegame", "scale_factor": 1.2, "win_range": (1, 5), "probability": 1.0},
                        {"criteria": "basegame", "scale_factor": 1.5, "win_range": (10, 50), "probability": 1.0},
                        {
                            "criteria": "freegame",
                            "scale_factor": 0.8,
                            "win_range": (500, 2000),
                            "probability": 1.0,
                        },
                        {
                            "criteria": "freegame",
                            "scale_factor": 1.2,
                            "win_range": (5000, 8000),
                            "probability": 1.0,
                        },
                    ]
                ).return_dict(),
                "parameters": ConstructParameters(
                    num_show=5000,
                    num_per_fence=10000,
                    min_m2m=4,
                    max_m2m=8,
                    pmb_rtp=1.0,
                    sim_trials=5000,
                    test_spins=[50, 100, 200],
                    test_weights=[0.3, 0.4, 0.3],
                    score_type="rtp",
                ).return_dict(),
                "distribution_bias": ConstructFenceBias(
                    applied_criteria=["basegame"],
                    bias_ranges=[(0.5, 1.5)],
                    bias_weights=[0.4],
                ).return_dict(),
            },
            "bonus": {
                "conditions": {
                    "wincap": ConstructConditions(
                        rtp=0.005, av_win=wincaps["bonus"], search_conditions=wincaps["bonus"]
                    ).return_dict(),
                    "freegame": ConstructConditions(rtp=0.957, hr="x").return_dict(),
                },
                "scaling": ConstructScaling(
                    [
                        {
                            "criteria": "freegame",
                            "scale_factor": 0.9,
                            "win_range": (50, 100),
                            "probability": 1.0,
                        },
                        {
                            "criteria": "freegame",
                            "scale_factor": 0.8,
                            "win_range": (500, 2000),
                            "probability": 1.0,
                        },
                        {
                            "criteria": "freegame",
                            "scale_factor": 1.2,
                            "win_range": (5000, 8000),
                            "probability": 1.0,
                        },
                    ]
                ).return_dict(),
                "parameters": ConstructParameters(
                    num_show=5000,
                    num_per_fence=10000,
                    min_m2m=4,
                    max_m2m=8,
                    pmb_rtp=1.0,
                    sim_trials=5000,
                    test_spins=[10, 20, 50],
                    test_weights=[0.6, 0.2, 0.2],
                    score_type="rtp",
                ).return_dict(),
            },
        }

        from copy import deepcopy

        self.game_config.opt_params["ante"] = deepcopy(self.game_config.opt_params["base"])
        self.game_config.opt_params["super"] = deepcopy(self.game_config.opt_params["bonus"])
        # Volatility limits (SDK rgs_verification): etl10k = P(10000x) * 10000 <= 0.8 and
        # etl40b <= 0.9, i.e. wincap RTP share <= 0.8 / cost. Keep a margin below the limit.
        sup_c = self.game_config.opt_params["super"]["conditions"]
        sup_c["wincap"] = ConstructConditions(
            rtp=0.0015, av_win=wincaps["super"], search_conditions=wincaps["super"]
        ).return_dict()
        sup_c["freegame"] = ConstructConditions(rtp=0.9605, hr="x").return_dict()
        # Ante: BR1 reels (~1.2x scatters) -> FS target ~1 in 140, larger FS share of RTP.
        ante_c = self.game_config.opt_params["ante"]["conditions"]
        # BR1 tiers: 1/151 + 1/2024 + 1/40826 = 1 in 140 total FS.
        ante_c["freegame"] = ConstructConditions(rtp=0.45, hr=151, search_conditions={"fstype": "regular"}).return_dict()
        ante_c["superfs"] = ConstructConditions(rtp=0.143, hr=2024, search_conditions={"fstype": "super"}).return_dict()
        ante_c["epicfs"] = ConstructConditions(rtp=0.0175, hr=40826, search_conditions={"fstype": "epic"}).return_dict()
        ante_c["basegame"] = ConstructConditions(hr=3.5, rtp=0.3415).return_dict()

        verify_optimization_input(self.game_config, self.game_config.opt_params)
