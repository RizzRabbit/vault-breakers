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
			// builds up with the scatters already landed: chasing 3 (teal), 4 = SUPER (gold), 5+ = EPIC (red, faster)
			const speed = level === 'epic' ? 60 : level === 'super' ? 90 : 120;
			alpha = Math.min(1, alpha + 0.08) * (0.65 + 0.35 * Math.sin(now / speed));
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

	const level = $derived(
		context.stateGame.scatterCounter >= 4 ? 'epic' : context.stateGame.scatterCounter >= 3 ? 'super' : 'regular',
	);
	const LOOK = {
		regular: { fill: 0x00e5d4, border: 0x7ff7ec, width: 4 },
		super: { fill: 0xffc832, border: 0xffe9a0, width: 6 },
		epic: { fill: 0xf02828, border: 0xff8a7a, width: 8 },
	} as const;
	const look = $derived(LOOK[level]);
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
	backgroundColor={look.fill}
	backgroundAlpha={(level === 'regular' ? 0.22 : 0.32) * alpha}
	borderColor={look.border}
	borderWidth={look.width}
	borderAlpha={alpha}
	borderRadius={10}
/>
