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
                    "freegame": ConstructConditions(
                        rtp=0.45, hr=200, search_conditions={"symbol": "scatter"}
                    ).return_dict(),
                    "basegame": ConstructConditions(hr=3.5, rtp=0.502).return_dict(),
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
                        rtp=0.01, av_win=wincaps["bonus"], search_conditions=wincaps["bonus"]
                    ).return_dict(),
                    "freegame": ConstructConditions(rtp=0.952, hr="x").return_dict(),
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
        # Ante: BR1 reels (~1.2x scatters) -> FS target ~1 in 140, larger FS share of RTP.
        ante_c = self.game_config.opt_params["ante"]["conditions"]
        ante_c["freegame"] = ConstructConditions(rtp=0.55, hr=140, search_conditions={"symbol": "scatter"}).return_dict()
        ante_c["basegame"] = ConstructConditions(hr=3.5, rtp=0.402).return_dict()

        verify_optimization_input(self.game_config, self.game_config.opt_params)
