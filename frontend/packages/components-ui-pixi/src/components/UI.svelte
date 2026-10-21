<script lang="ts">
	import type { Snippet } from 'svelte';

	import { stateUi } from 'state-shared';

	import UIDefault from './UIDefault.svelte';
	import UIReplay from './UIReplay.svelte';

	type Props = {
		gameName: Snippet;
		logo: Snippet;
	};

	const props: Props = $props();

	const UI_COMPONENT_MAP = {
		default: UIDefault,
		replay: UIReplay,
	};

	const UIComponent = $derived(UI_COMPONENT_MAP[stateUi.config.mode]);
</script>

<UIComponent>
	{#snippet gameName()}
		{@render props.gameName()}
	{/snippet}

	{#snippet logo()}
		{@render props.logo()}
	{/snippet}
</UIComponent>
