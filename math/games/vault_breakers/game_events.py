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


VAULT_METER_UPDATE = "vaultMeterUpdate"
VAULT_METER_UPGRADE = "vaultMeterUpgrade"


def vault_meter_update_event(gamestate):
    """Vault Meter advanced by one tumble (free spins only)."""
    gamestate.book.add_event(
        {
            "index": len(gamestate.book.events),
            "type": VAULT_METER_UPDATE,
            "meter": gamestate.vault_meter,
            "nextThreshold": next((t for t in gamestate.config.vault_meter_thresholds if t > gamestate.vault_meter), None),
        }
    )


def vault_meter_upgrade_event(gamestate, reel, row, old_mult, new_mult):
    """Vault Meter threshold reached: one spot moved up a tier."""
    gamestate.book.add_event(
        {
            "index": len(gamestate.book.events),
            "type": VAULT_METER_UPGRADE,
            "meter": gamestate.vault_meter,
            "position": {"reel": reel, "row": row},
            "oldMultiplier": old_mult,
            "newMultiplier": new_mult,
            "gridMultipliers": deepcopy(gamestate.position_multipliers),
        }
    )
