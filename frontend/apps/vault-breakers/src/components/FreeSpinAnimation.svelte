<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { Container, Sprite, Rectangle, type Sizes } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE, BOARD_DIMENSIONS } from '../game/constants';

	type Props = {
		children: Snippet<[{ sizes: Sizes }]>;
		// free-spin tier look: regular = gold plaque, super = steel-teal, epic = red x128 (pulsing)
		tier?: 'regular' | 'super' | 'epic';
	};

	// Vault Breakers plaque panel (code-animated pop-in) used by the free-spin intro and outro.
	const props: Props = $props();
	const context = getContext();
	const PLAQUE_RATIO = 1139 / 359;
	const SIZES = { width: SYMBOL_SIZE * BOARD_DIMENSIONS.y * 1.25, height: 0 };
	SIZES.height = (SIZES.width / PLAQUE_RATIO) * 1.6;
	const scale = new Tween(0.4, { duration: 350, easing: cubicOut });
	onMount(() => scale.set(1));
	const TIER = {
		regular: { tint: 0xffffff, glow: 0x000000, glowAlpha: 0 },
		super: { tint: 0xc8f4ff, glow: 0x00e5d4, glowAlpha: 0.45 },
		epic: { tint: 0xff8a7a, glow: 0xf02828, glowAlpha: 0.7 },
	} as const;
	const look = $derived(TIER[props.tier ?? 'regular']);
	let pulse = $state(0);
	onMount(() => {
		let raf = 0;
		const tick = (now: number) => {
			pulse = 0.5 + 0.5 * Math.sin((now / 700) * Math.PI * 2);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<MainContainer>
	<Container
		x={context.stateGameDerived.boardLayout().x}
		y={context.stateGameDerived.boardLayout().y}
		scale={scale.current}
	>
		{#if look.glowAlpha > 0}
			{#each [1.07, 1.03] as k, i}
				<Rectangle
					x={(-SIZES.width * k) / 2}
					y={(-SIZES.height * k) / 2}
					width={SIZES.width * k}
					height={SIZES.height * k}
					borderRadius={SIZES.height * 0.12}
					backgroundColor={look.glow}
					backgroundAlpha={look.glowAlpha * (i ? 0.35 : 0.18) * (0.6 + 0.4 * pulse)}
					borderColor={look.glow}
					borderWidth={6}
					borderAlpha={look.glowAlpha * (0.5 + 0.5 * pulse)}
				/>
			{/each}
		{/if}
		<Sprite key="vb_plaque" anchor={0.5} width={SIZES.width} height={SIZES.height} tint={look.tint} />
		{@render props.children({ sizes: SIZES })}
	</Container>
</MainContainer>
