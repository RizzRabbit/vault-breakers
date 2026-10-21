<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { Container, Sprite, type Sizes } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE, BOARD_DIMENSIONS } from '../game/constants';

	type Props = {
		children: Snippet<[{ sizes: Sizes }]>;
	};

	// Vault Breakers plaque panel (code-animated pop-in) used by the free-spin intro and outro.
	const props: Props = $props();
	const context = getContext();
	const PLAQUE_RATIO = 1139 / 359;
	const SIZES = { width: SYMBOL_SIZE * BOARD_DIMENSIONS.y * 1.25, height: 0 };
	SIZES.height = (SIZES.width / PLAQUE_RATIO) * 1.6;
	const scale = new Tween(0.4, { duration: 350, easing: cubicOut });
	onMount(() => scale.set(1));
</script>

<MainContainer>
	<Container
		x={context.stateGameDerived.boardLayout().x}
		y={context.stateGameDerived.boardLayout().y}
		scale={scale.current}
	>
		<Sprite key="vb_plaque" anchor={0.5} width={SIZES.width} height={SIZES.height} />
		{@render props.children({ sizes: SIZES })}
	</Container>
</MainContainer>
