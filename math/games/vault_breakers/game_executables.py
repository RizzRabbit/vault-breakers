"""Vault Breakers game executables with doubling spot multipliers"""

from game_calculations import GameCalculations
from src.calculations.cluster import Cluster
import random
from game_events import update_grid_mult_event, vault_meter_update_event, vault_meter_upgrade_event
from src.events.events import update_freespin_event


class GameExecutables(GameCalculations):
    """Game dependent grouped functions."""

    def reset_grid_mults(self):
        """Initialize all grid position multipliers to 0 (unmarked)."""
        self.position_multipliers = [
            [0 for _ in range(self.config.num_rows[reel])] for reel in range(self.config.num_reels)
        ]

    def update_grid_mults(self):
        """
        Vault Breakers spot multiplier logic:
        - First win on a spot: mark it (set to 1)
        - Each subsequent win: DOUBLE the multiplier (1 -> 2 -> 4 -> 8 -> 16 -> 32 -> 64 -> 128)
        - Cap at 128x
        - Each winning position is upgraded at most once per tumble (unique positions)
        """
        if self.win_data["totalWin"] > 0:
            # A spot upgrades at most once per tumble, even if a wild is shared by several clusters.
            unique_positions = []
            for win in self.win_data["wins"]:
                for pos in win["positions"]:
                    if (pos["reel"], pos["row"]) not in unique_positions:
                        unique_positions.append((pos["reel"], pos["row"]))
            for reel, row in unique_positions:
                if self.position_multipliers[reel][row] == 0:
                    # First win on this spot: mark it with 1x
                    self.position_multipliers[reel][row] = 1
                else:
                    # Subsequent win: double the multiplier
                    self.position_multipliers[reel][row] = min(
                        self.position_multipliers[reel][row] * 2,
                        self.config.maximum_board_mult
                    )
            update_grid_mult_event(self)

    def advance_vault_meter(self):
        """Vault Meter (free spins only): +1 per tumble; at each threshold (10/20/30) one random
        marked spot moves up one tier (marked -> x2 -> x4 ... cap x128). If no spot is marked
        (or all marked spots are already capped), a random unmarked spot becomes x2."""
        self.vault_meter += 1
        vault_meter_update_event(self)
        if self.vault_meter not in self.config.vault_meter_thresholds:
            return
        cap = self.config.maximum_board_mult
        spots = [(r, c) for r, col in enumerate(self.position_multipliers) for c, m in enumerate(col)]
        marked = [(r, c) for r, c in spots if 0 < self.position_multipliers[r][c] < cap]
        if marked:
            r, c = random.choice(marked)
            old = self.position_multipliers[r][c]
            new = 2 if old == 1 else min(old * 2, cap)
        else:
            free = [(r, c) for r, c in spots if self.position_multipliers[r][c] == 0]
            if not free:
                return
            r, c = random.choice(free)
            old, new = 0, 2
        self.position_multipliers[r][c] = new
        vault_meter_upgrade_event(self, r, c, old, new)

    def get_clusters_update_wins(self):
        """Find clusters on board and update win manager."""
        clusters = Cluster.get_clusters(self.board, "wild")
        return_data = {
            "totalWin": 0,
            "wins": [],
        }
        self.board, self.win_data = self.evaluate_clusters_with_grid(
            config=self.config,
            board=self.board,
            clusters=clusters,
            pos_mult_grid=self.position_multipliers,
            global_multiplier=self.global_multiplier,
            return_data=return_data,
        )

        Cluster.record_cluster_wins(self)
        self.win_manager.update_spinwin(self.win_data["totalWin"])
        self.win_manager.tumble_win = self.win_data["totalWin"]

    def update_freespin(self) -> None:
        """Called before a new reveal during freegame."""
        self.fs += 1
        update_freespin_event(self)
        self.win_manager.reset_spin_win()
        self.tumblewin_mult = 0
        self.win_data = {}
