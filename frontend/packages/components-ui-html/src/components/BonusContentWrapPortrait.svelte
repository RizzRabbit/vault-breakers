<script lang="ts">
	import type { Snippet } from 'svelte';

	import { getContextLayout } from 'utils-layout';
	import { resizeObserver, type ContentRect } from 'utils-resize-observer';

	import BaseContent from './BaseContent.svelte';
	import BaseScrollable from './BaseScrollable.svelte';

	type Props = {
		maxListLength: number;
		betAmount: Snippet;
		bonusCardsActivate: Snippet;
		bonusCardsBuy: Snippet;
	};

	const props: Props = $props();

	const { stateLayoutDerived } = getContextLayout();

	let contentRect = $state({ width: 0, height: 0, left: 0, top: 0 } as ContentRect);

	const horizontalScale = $derived(
		stateLayoutDerived.canvasSizes().width / (240 * (props.maxListLength || 1)),
	); // {maxListLength} columns, 240 is the width benchmark
	const verticalScale = $derived(
		(stateLayoutDerived.canvasSizes().height - 250) / (contentRect?.height || 0),
	);
	const scale = $derived(Math.min(verticalScale, horizontalScale));
	const scaled = $derived(scale < 1);
</script>

<BaseContent maxWidth="100%">
	<div class="wrap" class:scaled>
		<div
			class="bonuses"
			style="transform: scale({Math.min(scale, 1)});"
			use:resizeObserver={(value) => (contentRect = value)}
		>
			<BaseScrollable type="row" noScroll>
				{@render props.bonusCardsActivate()}
			</BaseScrollable>

			<BaseScrollable type="row" noScroll>
				{@render props.bonusCardsBuy()}
			</BaseScrollable>
		</div>

		{#if !scaled}
			<div>
				{@render props.betAmount()}
			</div>
		{/if}
	</div>

	{#if scaled}
		<div class="badge-amount-wrap-scaled">
			{@render props.betAmount()}
		</div>
	{/if}
</BaseContent>

<style lang="scss">
	.wrap {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, calc(-50%));

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		&.scaled {
			transform: translate(-50%, calc(-50% - 4rem));
		}
	}

	.bonuses {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		transform-origin: center center;
	}

	.badge-amount-wrap-scaled {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translate(-50%, -20%);
	}
</style>
