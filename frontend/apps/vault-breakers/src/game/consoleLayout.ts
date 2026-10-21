// Vault Breakers "heist console": the free-spin counter, loot (tumble win) and Vault Meter panels share
// one column left of the board (desktop/landscape), or one row above it (portrait/tablet).
// Slot 0 = free spins, 1 = loot, 2 = Vault Meter. Positions are MainContainer coords (panel top-left).
import { SYMBOL_SIZE } from './constants';
import { stateLayoutDerived } from './stateLayout';
import { stateGameDerived } from './stateGame.svelte';

export const CONSOLE_PANEL = { width: SYMBOL_SIZE * 2.4, height: (SYMBOL_SIZE * 2.4) / (992 / 623) };
const GAP = SYMBOL_SIZE * 0.12;

export const consoleRow = () => ['portrait', 'tablet'].includes(stateLayoutDerived.layoutType());

export const consoleSlot = (slot: 0 | 1 | 2) => {
	const b = stateGameDerived.boardLayout();
	const left = b.x - b.width * 0.5;
	const top = b.y - b.height * 0.5;
	if (consoleRow()) {
		const scale = (b.width - GAP * 2) / (CONSOLE_PANEL.width * 3);
		const w = CONSOLE_PANEL.width * scale;
		const h = CONSOLE_PANEL.height * scale;
		return { x: left + slot * (w + GAP), y: top - h - GAP, scale };
	}
	return {
		x: left - CONSOLE_PANEL.width - SYMBOL_SIZE * 0.45,
		y: top + slot * (CONSOLE_PANEL.height + GAP),
		scale: 1,
	};
};
