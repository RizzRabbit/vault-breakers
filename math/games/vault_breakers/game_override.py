"""Vault Breakers game state override"""

from game_executables import GameExecutables
from game_events import update_grid_mult_event


class GameStateOverride(GameExecutables):
    """Overrides for Vault Breakers specific game logic."""

    def reset_book(self):
        """Override to reset spot multipliers for base game spins."""
        super().reset_book()
        # Reset multipliers at start of each base spin
        self.reset_grid_mults()

    def reset_fs_spin(self):
        """Override to initialize spot multipliers for freespin round."""
        super().reset_fs_spin()
        # Initialize multipliers at start of FS round (persist throughout)
        self.reset_grid_mults()
        self.vault_meter = 0
        if getattr(self, "betmode", None) == "super":
            # Super buy: every spot starts at x2
            self.position_multipliers = [
                [2 for _ in range(self.config.num_rows[reel])] for reel in range(self.config.num_reels)
            ]
            update_grid_mult_event(self)

    def draw_board(self, emit_event: bool = True, trigger_symbol: str = "scatter") -> None:
        """In unbiased 'natural' measurement mode, base boards are drawn straight from the
        reels (scatter boards are not rejected), so FS triggers occur at their true rate."""
        if (
            self.criteria == "natural"
            and self.gametype == self.config.basegame_type
            and not self.get_current_distribution_conditions()["force_freegame"]
        ):
            self.create_board_reelstrips()
            if emit_event:
                from src.events.events import reveal_event

                reveal_event(self)
            return
        super().draw_board(emit_event, trigger_symbol)

    def check_freespin_entry(self, scatter_key: str = "scatter") -> bool:
        if self.criteria == "natural":
            return True
        return super().check_freespin_entry(scatter_key)

    def assign_special_sym_function(self):
        """No special symbol functions needed for Vault Breakers."""
        pass

    def check_repeat(self) -> None:
        """Checks if the spin failed a criteria constraint at any point."""
        if self.repeat is False:
            if self.criteria == "natural":
                # Unbiased measurement mode (see measure_natural.py): accept every outcome.
                if self.get_current_distribution_conditions()["force_freegame"] and not (self.triggered_freegame):
                    self.repeat = True
                return
            win_criteria = self.get_current_betmode_distributions().get_win_criteria()
            if win_criteria is not None and self.final_win != win_criteria:
                self.repeat = True

            if self.get_current_distribution_conditions()["force_freegame"] and not (self.triggered_freegame):
                self.repeat = True

            if self.win_manager.running_bet_win == 0 and self.criteria != "0":
                self.repeat = True
