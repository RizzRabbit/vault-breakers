<script lang="ts">
	import { Text, Rectangle } from 'pixi-svelte';
	import { stateBet } from 'state-shared';
	import { WHITE } from 'constants-shared/colors';

	import { UI_BASE_SIZE } from '../constants';

	const fontSizeMultiplier = $derived.by(() => {
		if (stateBet.autoSpinsCounter === Infinity) return 3;
		if (stateBet.autoSpinsCounter > 99) return 1.5;
		if (stateBet.autoSpinsCounter > 9) return 2;
		return 2.5;
	});
</script>

{#if stateBet.autoSpinsCounter > 0}
	<Rectangle
		anchor={0.5}
		width={UI_BASE_SIZE * 0.9}
		height={UI_BASE_SIZE * 0.9}
		borderRadius={50}
	/>
	<Text
		anchor={0.5}
		text={stateBet.autoSpinsCounter === Infinity ? '∞' : stateBet.autoSpinsCounter}
		style={{
			fontFamily: 'proxima-nova',
			fill: WHITE,
			fontWeight: 'bold',
			fontSize: fontSizeMultiplier * UI_BASE_SIZE * 0.2,
		}}
	/>
{/if}
