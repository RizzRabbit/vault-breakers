"""Vault Breakers game events"""

from copy import deepcopy

APPLY_TUMBLE_MULTIPLIER = "applyMultiplierToTumble"
UPDATE_GRID = "updateGrid"


def update_grid_mult_event(gamestate):
    """Pass updated position multipliers after a win."""
    event = {
        "index": len(gamestate.book.events),
        "type": UPDATE_GRID,
        "gridMultipliers": deepcopy(gamestate.position_multipliers),
    }
    gamestate.book.add_event(event)
