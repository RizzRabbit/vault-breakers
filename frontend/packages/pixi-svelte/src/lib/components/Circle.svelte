<script lang="ts" module>
	import * as PIXI from 'pixi.js';

	import { type Props as BaseProps } from './Graphics.svelte';
	import type { PixiPoint } from '../types';

	export type Props = Omit<BaseProps, 'pivot' | 'draw'> & {
		anchor?: PixiPoint;
		// draw
		diameter: number;
		backgroundColor?: PIXI.FillStyle['color'];
		backgroundAlpha?: PIXI.FillStyle['alpha'];
		borderColor?: PIXI.StrokeStyle['color'];
		borderWidth?: PIXI.StrokeStyle['width'];
		borderAlpha?: PIXI.StrokeStyle['alpha'];
	};
</script>

<script lang="ts">
	import Graphics from './Graphics.svelte';
	import { anchorToPivot } from '../utils.svelte';

	const {
		anchor,
		diameter,
		backgroundColor,
		backgroundAlpha,
		borderColor,
		borderWidth,
		borderAlpha,
		...graphicsProps
	}: Props = $props();
</script>

<Graphics
	{...graphicsProps}
	pivot={anchorToPivot({ anchor, sizes: { width: diameter, height: diameter } })}
	draw={(graphics) => {
		const radius = diameter * 0.5;
		graphics.circle(diameter * 0.5, diameter * 0.5, radius);
		graphics.fill({
			color: backgroundColor ?? 0x000000,
			alpha: backgroundAlpha ?? 1,
		} as PIXI.FillStyle);
		graphics.stroke({
			color: borderColor ?? 0x000000,
			width: borderWidth ?? 0,
			alpha: borderAlpha ?? 1,
		} as PIXI.StrokeStyle);
	}}
/>
