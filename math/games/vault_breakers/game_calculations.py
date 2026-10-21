"""Vault Breakers game calculations with spot multipliers"""

from src.executables.executables import Executables
from src.calculations.cluster import Cluster
from src.calculations.board import Board
from src.config.config import Config


class GameCalculations(Executables):
    """
    Cluster evaluation with Vault Breakers spot multiplier logic:
    cluster pay = base pay × (sum of spot multipliers in cluster)
    """

    def evaluate_clusters_with_grid(
        self,
        config: Config,
        board: Board,
        clusters: dict,
        pos_mult_grid: list,
        global_multiplier: int = 1,
        return_data: dict = {"totalWin": 0, "wins": []},
    ) -> type:
        """
        Determine payout amount from cluster, including position multipliers.
        Each cluster pays: base_pay × sum_of_spot_multipliers × global_multiplier
        """
        exploding_symbols = []
        total_win = 0
        for sym in clusters:
            for cluster in clusters[sym]:
                syms_in_cluster = len(cluster)
                if (syms_in_cluster, sym) in config.paytable:
                    # Sum all spot multipliers in the cluster (0 counts as 0, not 1)
                    board_mult = 0
                    for positions in cluster:
                        board_mult += pos_mult_grid[positions[0]][positions[1]]
                    # If no multipliers active, treat as 1x
                    board_mult = max(board_mult, 1)
                    
                    sym_win = config.paytable[(syms_in_cluster, sym)] * (
                        config.freegame_pay_ratio if self.gametype == config.freegame_type else 1.0
                    )
                    symwin_mult = round(sym_win * board_mult * global_multiplier, 2)
                    total_win += symwin_mult
                    
                    json_positions = [{"reel": p[0], "row": p[1]} for p in cluster]
                    central_pos = Cluster.get_central_cluster_position(json_positions)
                    
                    return_data["wins"] += [
                        {
                            "symbol": sym,
                            "clusterSize": syms_in_cluster,
                            "win": symwin_mult,
                            "positions": json_positions,
                            "meta": {
                                "globalMult": global_multiplier,
                                "clusterMult": board_mult,
                                "winWithoutMult": sym_win,
                                "overlay": {"reel": central_pos[0], "row": central_pos[1]},
                            },
                        }
                    ]

                    for positions in cluster:
                        board[positions[0]][positions[1]].explode = True
                        if {
                            "reel": positions[0],
                            "row": positions[1],
                        } not in exploding_symbols:
                            exploding_symbols.append({"reel": positions[0], "row": positions[1]})

        return_data["totalWin"] += total_win

        return board, return_data
