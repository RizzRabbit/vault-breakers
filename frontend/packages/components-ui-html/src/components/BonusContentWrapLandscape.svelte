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

	const verticalScale = $derived(stateLayoutDerived.canvasSizes().height / (270 * 2)); // 2 rows, 270 is the height benchmark
	const horizontalScale = $derived(
		(stateLayoutDerived.canvasSizes().width - 250) / (contentRect?.width || 0),
	);
	const scale = $derived(Math.min(verticalScale, horizontalScale));
</script>

<BaseContent maxWidth="100%">
	<div class="bonuses-wrap" use:resizeObserver={(value) => (contentRect = value)}>
		<div class="bonuses" style="transform: scale({Math.min(scale, 1)});">
			<BaseScrollable type="row" noScroll>
				{@render props.bonusCardsActivate()}
			</BaseScrollable>

			<BaseScrollable type="row" noScroll>
				{@render props.bonusCardsBuy()}
			</BaseScrollable>
		</div>
	</div>

	<div class="badge-amount-wrap">
		{@render props.betAmount()}
	</div>
</BaseContent>

<style lang="scss">
	.bonuses-wrap {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(calc(-50% - 7rem), -50%);
	}

	.bonuses {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		transform-origin: center center;
	}

	.badge-amount-wrap {
		position: fixed;
		top: calc(50% + 1.2rem);
		right: 1rem;
		transform: translateY(-50%);
	}
</style>
