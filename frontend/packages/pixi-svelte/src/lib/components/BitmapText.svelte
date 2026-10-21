<script lang="ts" module>
	import * as PIXI from 'pixi.js';

	import type { Sizes, OverwriteCursor } from '../types';

	export type Props = OverwriteCursor<PIXI.TextOptions> & {
		onresize?: (arg0: Sizes) => void;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { propsSyncEffect } from '../utils.svelte';
	import { getContextParent } from '../context.svelte';

	const props: Props = $props();
	const parentContext = getContextParent();
	const bitmapText = new PIXI.BitmapText({ text: props.text, style: props.style });

	propsSyncEffect({ props, target: bitmapText, ignore: ['onresize'] });

	$effect(() => {
		props?.text;
		props?.style;
		props.onresize?.({ width: bitmapText.width, height: bitmapText.height });
	});

	onMount(() => {
		props.onresize?.({ width: bitmapText.width, height: bitmapText.height });
	});

	parentContext.addToParent(bitmapText);
</script>
