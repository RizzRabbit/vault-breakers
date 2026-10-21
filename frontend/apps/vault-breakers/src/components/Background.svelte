<script lang="ts">
	import { Rectangle, Sprite } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { SECOND } from 'constants-shared/time';

	import { getContext } from '../game/context';

	// Vault Breakers static vault backdrop (cover-fit), landscape 16:9 or portrait 9:16.
	const context = getContext();
	const isPortrait = $derived(context.stateLayoutDerived.layoutType() === 'portrait');
	const bgKey = $derived(isPortrait ? 'vb_bg_portrait' : 'vb_bg_landscape');
	const bgRatio = $derived(isPortrait ? 576 / 1024 : 1024 / 576);
	const bgProps = $derived.by(() => {
		const { width, height } = context.stateLayoutDerived.canvasSizes();
		const scale = Math.max(width / bgRatio, height);
		return { x: width / 2, y: height / 2, width: scale * bgRatio, height: scale, anchor: 0.5 };
	});
	const showFeatureBackground = $derived(context.stateGame.gameType === 'freegame');
</script>

<Rectangle {...context.stateLayoutDerived.canvasSizes()} backgroundColor={0x000000} zIndex={-3} />

<FadeContainer show={true} duration={SECOND} zIndex={-2}>
	<Sprite key={bgKey} {...bgProps} />
</FadeContainer>

<!-- free spins: teal-tinted wash over the same vault -->
<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
	<Rectangle
		{...context.stateLayoutDerived.canvasSizes()}
		backgroundColor={0x00e5d4}
		backgroundAlpha={0.12}
	/>
</FadeContainer>
