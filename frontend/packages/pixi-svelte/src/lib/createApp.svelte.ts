import * as PIXI from 'pixi.js';

import type { LoadedAssets, Assets } from './types';

export function createApp({ assets }: { assets: Assets }) {
	const reset = () => {
		stateApp.loaded = false;
		stateApp.loadingProgress = 0;
		stateApp.loadedAssets = {};
		stateApp.pixiApplication = undefined as PIXI.Application | undefined;
	};

	const stateApp = $state({
		reset,
		assets,
		loaded: false,
		loadingProgress: 0,
		loadedAssets: {} as LoadedAssets,
		pixiApplication: undefined as PIXI.Application | undefined,
	});

	return {
		stateApp,
	};
}

export type App = ReturnType<typeof createApp>;
