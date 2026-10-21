import _ from 'lodash';

import type { RawSymbol, SymbolState } from './types';

export const SYMBOL_SIZE = 112;

export const REEL_PADDING = 0.53;

// initial board (padded top and bottom)
export const INITIAL_BOARD: RawSymbol[][] = [[{"name": "L3"}, {"name": "W"}, {"name": "L3"}, {"name": "H3"}, {"name": "L4"}, {"name": "H4"}, {"name": "L1"}], [{"name": "L4"}, {"name": "L2"}, {"name": "L2"}, {"name": "H2"}, {"name": "L3"}, {"name": "L2"}, {"name": "L4"}], [{"name": "L3"}, {"name": "L3"}, {"name": "L3"}, {"name": "H2"}, {"name": "L4"}, {"name": "L2"}, {"name": "L4"}], [{"name": "L3"}, {"name": "L3"}, {"name": "L3"}, {"name": "L4"}, {"name": "L4"}, {"name": "L4"}, {"name": "H3"}], [{"name": "L1"}, {"name": "L3"}, {"name": "L2"}, {"name": "L1"}, {"name": "L3"}, {"name": "L2"}, {"name": "L2"}]];

export const BOARD_DIMENSIONS = { x: INITIAL_BOARD.length, y: INITIAL_BOARD[0].length - 2 };

export const BOARD_SIZES = {
	width: SYMBOL_SIZE * BOARD_DIMENSIONS.x,
	height: SYMBOL_SIZE * BOARD_DIMENSIONS.y,
};

export const BACKGROUND_RATIO = 2039 / 1000;
export const PORTRAIT_BACKGROUND_RATIO = 1242 / 2208;
const PORTRAIT_RATIO = 800 / 1422;
const LANDSCAPE_RATIO = 1600 / 900;
const DESKTOP_RATIO = 1422 / 800;

const DESKTOP_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 900;
const PORTRAIT_HEIGHT = 1422;
export const DESKTOP_MAIN_SIZES = { width: DESKTOP_HEIGHT * DESKTOP_RATIO, height: DESKTOP_HEIGHT };
export const LANDSCAPE_MAIN_SIZES = {
	width: LANDSCAPE_HEIGHT * LANDSCAPE_RATIO,
	height: LANDSCAPE_HEIGHT,
};
export const PORTRAIT_MAIN_SIZES = {
	width: PORTRAIT_HEIGHT * PORTRAIT_RATIO,
	height: PORTRAIT_HEIGHT,
};

export const HIGH_SYMBOLS = ['H1', 'H2', 'H3', 'H4'];

export const INITIAL_SYMBOL_STATE: SymbolState = 'static';


const SPIN_OPTIONS_SHARED = {
	reelFallInDelay: 80,
	reelPaddingMultiplierNormal: 1.25,
	reelPaddingMultiplierAnticipated: 18,
	reelFallOutDelay: 145,
};

export const SPIN_OPTIONS_DEFAULT = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 3.5,
	symbolFallInInterval: 30,
	symbolFallInBounceSpeed: 0.15,
	symbolFallInBounceSizeMulti: 0.5,
	symbolFallOutSpeed: 3.5,
	symbolFallOutInterval: 20,
};

export const SPIN_OPTIONS_FAST = {
	...SPIN_OPTIONS_SHARED,
	symbolFallInSpeed: 7,
	symbolFallInInterval: 0,
	symbolFallInBounceSpeed: 0.3,
	symbolFallInBounceSizeMulti: 0.25,
	symbolFallOutSpeed: 7,
	symbolFallOutInterval: 0,
};

export const MOTION_BLUR_VELOCITY = 31;

export const zIndexes = {
	background: {
		backdrop: -3,
		normal: -2,
		feature: -1,
	},
};

// Vault Breakers art: static sprites for every state; win/land feedback is a scale + glow in SymbolSprite.
const vb = (key: string, size = 0.92) => ({
	type: 'sprite',
	assetKey: `vb_${key}`,
	sizeRatios: { width: size, height: size },
});
const symbolStates = (key: string, size?: number) => {
	const info = vb(key, size);
	return { explosion: info, win: info, postWinStatic: info, static: info, spin: info, land: info };
};

export const SYMBOL_INFO_MAP = {
	H1: symbolStates('h1'),
	H2: symbolStates('h2'),
	H3: symbolStates('h3'),
	H4: symbolStates('h4'),
	L1: symbolStates('l1', 0.84),
	L2: symbolStates('l2', 0.84),
	L3: symbolStates('l3', 0.84),
	L4: symbolStates('l4', 0.84),
	W: symbolStates('w', 1),
	S: symbolStates('s', 1),
} as const;

export const SCATTER_LAND_SOUND_MAP = {
	1: 'sfx_scatter_stop_1',
	2: 'sfx_scatter_stop_2',
	3: 'sfx_scatter_stop_3',
	4: 'sfx_scatter_stop_4',
	5: 'sfx_scatter_stop_5',
} as const;
