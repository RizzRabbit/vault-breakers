<script lang="ts">
	import { Rectangle } from 'pixi-svelte';
	import { onDestroy, onMount } from 'svelte';

	import { getContext } from '../game/context';
	import type { Reel } from '../game/stateGame.svelte';
	import { REEL_PADDING, SYMBOL_SIZE, BOARD_DIMENSIONS } from '../game/constants';

	type Props = {
		reel: Reel;
		oncomplete: () => void;
	};

	// Code-drawn anticipation: a pulsing teal column over the reel; fades out once the reel stops.
	const props: Props = $props();
	const context = getContext();

	let alpha = $state(0);
	let stopping = false;
	let completed = false;
	let raf = 0;

	const finish = () => {
		if (completed) return;
		completed = true;
		props.oncomplete();
	};

	const tick = (now: number) => {
		if (stopping) {
			alpha = Math.max(0, alpha - 0.06);
			if (alpha <= 0) return finish();
		} else {
			alpha = Math.min(1, alpha + 0.08) * (0.65 + 0.35 * Math.sin(now / 120));
		}
		raf = requestAnimationFrame(tick);
	};

	onMount(() => (raf = requestAnimationFrame(tick)));
	onDestroy(() => {
		cancelAnimationFrame(raf);
		finish();
	});

	$effect(() => {
		if (props.reel.reelState.motion === 'stopped') stopping = true;
	});

	const x = $derived(
		context.stateGameDerived.boardLayout().x -
			context.stateGameDerived.boardLayout().width * 0.5 +
			(props.reel.reelIndex + REEL_PADDING - 0.53) * SYMBOL_SIZE,
	);
	const y = $derived(
		context.stateGameDerived.boardLayout().y - context.stateGameDerived.boardLayout().height * 0.5,
	);
</script>

<Rectangle
	{x}
	{y}
	width={SYMBOL_SIZE}
	height={SYMBOL_SIZE * BOARD_DIMENSIONS.y}
	backgroundColor={0x00e5d4}
	backgroundAlpha={0.22 * alpha}
	borderColor={0x7ff7ec}
	borderWidth={4}
	borderAlpha={alpha}
	borderRadius={10}
/>
