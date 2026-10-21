<script lang="ts">
	import type { Snippet } from 'svelte';

	import { BitmapText, Container, Sprite, type Sizes } from 'pixi-svelte';

	import { SYMBOL_SIZE } from '../game/constants';

	type Props = {
		children: Snippet<[{ frameSizes: Sizes }]>;
	};

	const props: Props = $props();
			const TITLE_HEIGHT = SYMBOL_SIZE * 0.28;

	const PANEL_KEY = 'vb_plaque';
	const PANEL_RATIO = 1139 / 359;
	const PANEL_HEIGHT = SYMBOL_SIZE * 0.8;
	const PANEL_SIZES = {
		width: PANEL_HEIGHT * PANEL_RATIO,
		height: PANEL_HEIGHT,
	};
</script>

<Sprite anchor={0.5} key={PANEL_KEY} {...PANEL_SIZES} />

<Container y={-TITLE_HEIGHT * 1.2}>
	<BitmapText
		anchor={0.5}
		y={-TITLE_HEIGHT * 0.025}
		text="TUMBLE WIN"
		style={{ fontFamily: 'silver', fontSize: TITLE_HEIGHT * 0.6 }}
	/>
</Container>

{@render props.children({ frameSizes: PANEL_SIZES })}
