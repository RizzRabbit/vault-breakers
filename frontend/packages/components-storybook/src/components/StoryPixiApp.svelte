<script lang="ts">
	import {
		App,
		setContextApp,
		createApp,
		type Assets,
	} from 'pixi-svelte';
	import type { Snippet } from 'svelte'

	type Props = { assets: Assets, children: Snippet };

	const props: Props = $props();
	const { stateApp } = createApp({ assets: props.assets });
	setContextApp({ stateApp });
</script>

<App>
	{#if stateApp.loaded}
		{@render props.children()}
	{:else}
		Loading...
	{/if}
</App>
