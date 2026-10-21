import * as svelte from 'svelte';

const BOARD_CONTEXT_NS = '@@board';
type BoardContext = { animate: boolean };
export const setContextBoard = (value: BoardContext) => {
	svelte.setContext(BOARD_CONTEXT_NS, value);
};
export const getContextBoard = () => svelte.getContext(BOARD_CONTEXT_NS) as BoardContext;
