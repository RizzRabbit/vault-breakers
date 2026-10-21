"""Vault Breakers game state override"""

from game_executables import GameExecutables


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

    def assign_special_sym_function(self):
        """No special symbol functions needed for Vault Breakers."""
        pass

    def check_repeat(self) -> None:
        """Checks if the spin failed a criteria constraint at any point."""
        if self.repeat is False:
            win_criteria = self.get_current_betmode_distributions().get_win_criteria()
            if win_criteria is not None and self.final_win != win_criteria:
                self.repeat = True

            if self.get_current_distribution_conditions()["force_freegame"] and not (self.triggered_freegame):
                self.repeat = True

            if self.win_manager.running_bet_win == 0 and self.criteria != "0":
                self.repeat = True
