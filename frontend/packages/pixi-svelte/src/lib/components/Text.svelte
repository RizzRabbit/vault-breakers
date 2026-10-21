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
	const text = new PIXI.Text({ text: props.text, style: props.style });

	propsSyncEffect({ props, target: text, ignore: ['onresize'] });

	$effect(() => {
		props?.text;
		props?.style;
		props.onresize?.({ width: text.width, height: text.height });
	});

	onMount(() => {
		props.onresize?.({ width: text.width, height: text.height });
	});

	parentContext.addToParent(text);
</script>
