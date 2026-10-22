"""Vault Breakers game state override"""

from game_executables import GameExecutables
from game_events import update_grid_mult_event


class GameStateOverride(GameExecutables):
    """Overrides for Vault Breakers specific game logic."""

    def reset_book(self):
        """Override to reset spot multipliers for base game spins."""
        super().reset_book()
        self.buy_trigger_bad = False
        # Reset multipliers at start of each base spin
        self.reset_grid_mults()

    def reset_fs_spin(self):
        """Override to initialize spot multipliers for freespin round."""
        super().reset_fs_spin()
        # Initialize multipliers at start of FS round (persist throughout)
        self.reset_grid_mults()
        self.vault_meter = 0
        start = self.config.fs_tier_start[getattr(self, "fs_tier", "regular")]
        self.position_multipliers = [
            [start for _ in range(self.config.num_rows[reel])] for reel in range(self.config.num_reels)
        ]
        # First updateGrid after the trigger carries the tier's start gridMultipliers.
        update_grid_mult_event(self)

    def get_fs_tier(self, scatter_key: str = "scatter") -> str:
        """bonus buy = regular, super buy = super; natural: 3 regular, 4 super, 5+ epic."""
        bm = getattr(self, "betmode", "base")
        if bm == "bonus":
            return "regular"
        if bm == "super":
            return "super"
        n = self.count_special_symbols(scatter_key)
        return "regular" if n <= 3 else ("super" if n == 4 else "epic")

    def _tag_fs_type(self):
        ev = self.book.events[-1]
        if ev.get("type") in ("freeSpinTrigger", "freeSpinRetrigger"):
            ev["fsType"] = self.fs_tier

    def update_freespin_amount(self, scatter_key: str = "scatter") -> None:
        super().update_freespin_amount(scatter_key)
        self._tag_fs_type()

    def update_fs_retrigger_amt(self, scatter_key: str = "scatter") -> None:
        super().update_fs_retrigger_amt(scatter_key)
        self._tag_fs_type()

    def run_freespin_from_base(self, scatter_key: str = "scatter") -> None:
        """Tiered FS entry. Epic rounds are redrawn (FS round only) until they pay >= 200x."""
        from copy import deepcopy

        self.fs_tier = self.get_fs_tier(scatter_key)
        # Buys: the trigger must land exactly the forced count (bonus 3, super 4); tumbles can add
        # extra scatters, so such outcomes are rejected and redrawn (see check_repeat).
        need = {"bonus": 3, "super": 4}.get(self.betmode)
        if need is not None and self.gametype == self.config.basegame_type and self.count_special_symbols(scatter_key) != need:
            self.buy_trigger_bad = True
        self.record(
            {
                "kind": self.count_special_symbols(scatter_key),
                "symbol": scatter_key,
                "gametype": self.gametype,
                "fstype": self.fs_tier,
            }
        )
        self.update_freespin_amount(scatter_key)
        if self.fs_tier != "epic":
            self.run_freespin()
            return
        names = ["book", "win_manager", "fs", "tot_fs", "wincap_triggered", "gametype", "board",
                 "special_syms_on_board", "win_data", "position_multipliers", "vault_meter"]
        snap = {k: deepcopy(getattr(self, k)) for k in names if hasattr(self, k)}
        start_win = self.win_manager.running_bet_win
        self.epic_redraws = 0
        while True:
            self.run_freespin()
            round_win = round(self.win_manager.running_bet_win - start_win, 1)
            if self.wincap_triggered or round_win >= self.config.epic_min_win:
                return
            self.epic_redraws += 1
            for k, v in snap.items():
                setattr(self, k, deepcopy(v))

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

            if getattr(self, "buy_trigger_bad", False):
                self.repeat = True

            if self.win_manager.running_bet_win == 0 and self.criteria != "0":
                self.repeat = True
