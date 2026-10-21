<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getContextApp } from 'pixi-svelte';

	type Props = { children: Snippet<[{ x: number; y: number; }]> };

	const props: Props = $props();

	const context = getContextApp();

	let x = $state(0);
	let y = $state(0);

	if(context.stateApp.pixiApplication) {
		context.stateApp.pixiApplication.canvas.onmousemove = (e) => {
			x = e.x;
			y = e.y;
		};
	}
</script>

{@render props.children({ x , y })}
