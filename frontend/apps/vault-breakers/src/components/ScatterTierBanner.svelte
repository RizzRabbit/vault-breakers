<script lang="ts">
	// Scatter land build-up (base/ante): once 3+ VAULTs have landed in a spin, a banner above the
	// board names the tier being reached (3 = FREE SPINS, 4 = SUPER, 5+ = EPIC) and pops on each new VAULT.
	import { BitmapText, Container, Rectangle } from 'pixi-svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE, BOARD_DIMENSIONS } from '../game/constants';

	const context = getContext();
	const count = $derived(context.stateGame.gameType === 'basegame' ? context.stateGame.scatterCounter : 0);
	const LOOK = [
		{ min: 5, text: 'EPIC FREE SPINS', color: 0xf02828, fill: 0xff8a7a },
		{ min: 4, text: 'SUPER FREE SPINS', color: 0xffc832, fill: 0xfff0b0 },
		{ min: 3, text: 'FREE SPINS', color: 0x00e5d4, fill: 0xffffff },
	];
	const look = $derived(LOOK.find((l) => count >= l.min));
	const pop = new Tween(1, { duration: 260, easing: cubicOut });
	$effect(() => {
		if (count >= 3) {
			pop.set(1.35, { duration: 0 });
			pop.set(1);
		}
	});
	const W = SYMBOL_SIZE * BOARD_DIMENSIONS.x * 0.9;
	const H = SYMBOL_SIZE * 0.55;
</script>

{#if look}
	<Container
		x={context.stateGameDerived.boardLayout().x}
		y={context.stateGameDerived.boardLayout().y - (SYMBOL_SIZE * BOARD_DIMENSIONS.y) / 2 - H * 0.2}
		scale={pop.current}
	>
		<Rectangle
			x={-W / 2}
			y={-H / 2}
			width={W}
			height={H}
			borderRadius={H * 0.3}
			backgroundColor={0x07101f}
			backgroundAlpha={0.9}
			borderColor={look.color}
			borderWidth={5}
		/>
		<BitmapText
			anchor={0.5}
			text={`${count} VAULTS · ${look.text}`.replace('·', '-')}
			style={{ fontFamily: 'gold', fill: look.fill, fontSize: H * 0.5 }}
		/>
	</Container>
{/if}
