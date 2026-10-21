<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createContextParent, getContextApp } from '../context.svelte';

	type Props = { children: Snippet };

	const props: Props = $props();
	const context = getContextApp();

	let parentContext = createContextParent(
		context.stateApp.pixiApplication?.stage ?? new PIXI.Container(),
	);
</script>

{#if parentContext.parent}
	{@render props.children()}
{/if}
