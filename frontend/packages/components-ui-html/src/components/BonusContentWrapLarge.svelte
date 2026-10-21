<script lang="ts">
	import type { Snippet } from 'svelte';

	import BaseContent from './BaseContent.svelte';
	import BaseScrollable from './BaseScrollable.svelte';

	type Props = {
		betAmount: Snippet;
		bonusCardsActivate: Snippet;
		bonusCardsBuy: Snippet;
	};

	const props: Props = $props();
</script>

<BaseContent maxWidth="100%">
	{@render props.betAmount()}

	<BaseScrollable type="column">
		<div class="bonuses-wrap">
			{@render props.bonusCardsActivate()}
			{@render props.bonusCardsBuy()}
		</div>
	</BaseScrollable>
</BaseContent>

<style lang="scss">
	.bonuses-wrap {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
