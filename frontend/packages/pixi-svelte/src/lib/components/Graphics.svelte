<script lang="ts" module>
	import * as PIXI from 'pixi.js';

	import type { OverwriteCursor } from '../types';

	export type Props = OverwriteCursor<PIXI.GraphicsOptions> & {
		isMask?: boolean;
		draw: (graphics: PIXI.Graphics) => void;
	};
</script>

<script lang="ts">
	import { propsSyncEffect } from '../utils.svelte';
	import { getContextParent } from '../context.svelte';

	const props: Props = $props();
	const parentContext = getContextParent();
	const graphics = new PIXI.Graphics();

	propsSyncEffect({ props, target: graphics, ignore: ['isMask', 'draw'] });

	$effect(() => {
		if (props.isMask !== undefined) {
			parentContext.parent.mask = props.isMask ? graphics : null;
		}
	});

	$effect(() => {
		if (props.draw) {
			graphics.clear();
			props.draw(graphics);
		}
	});

	parentContext.addToParent(graphics);
</script>
