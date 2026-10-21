<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Rectangle, Sprite } from 'pixi-svelte';
	import { onDestroy } from 'svelte';

	import { getContext } from '../game/context';

	// Vault Breakers steel/gold reel frame (board_frame.png: the inner opening is ~64% of the image).
	const context = getContext();
	const INNER_RATIO = 0.655;

	let glowOn = $state(false);
	let glow = $state(0);
	let raf = 0;
	const tick = (now: number) => {
		glow = glowOn ? 0.35 + 0.25 * Math.sin(now / 220) : Math.max(0, glow - 0.05);
		if (glowOn || glow > 0) raf = requestAnimationFrame(tick);
	};

	context.eventEmitter.subscribeOnMount({
		boardFrameGlowShow: () => {
			glowOn = true;
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(tick);
		},
		boardFrameGlowHide: () => (glowOn = false),
	});
	onDestroy(() => cancelAnimationFrame(raf));

	const layout = $derived(context.stateGameDerived.boardLayout());
	const frameSize = $derived(layout.width / INNER_RATIO);
</script>

<!-- dark glass backing behind the reels -->
<Rectangle
	x={layout.x - layout.width / 2 - 6}
	y={layout.y - layout.height / 2 - 6}
	width={layout.width + 12}
	height={layout.height + 12}
	backgroundColor={0x0a1428}
	backgroundAlpha={0.82}
	borderRadius={8}
/>

<Sprite key="vb_board_frame" anchor={0.5} x={layout.x} y={layout.y} width={frameSize} height={frameSize} />

{#if glow > 0}
	<Sprite
		key="vb_board_frame"
		anchor={0.5}
		x={layout.x}
		y={layout.y}
		width={frameSize}
		height={frameSize}
		alpha={glow}
		blendMode="add"
		tint={0x00e5d4}
	/>
{/if}
