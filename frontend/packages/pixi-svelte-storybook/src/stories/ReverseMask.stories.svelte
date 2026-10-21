<script lang="ts" module>
	import * as PIXI from 'pixi.js';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Circle } from 'pixi-svelte';

	import { StoryPixiApp } from 'components-storybook';

	import {
		Container,
		Rectangle,
	} from 'pixi-svelte';

	const { Story } = defineMeta({
		title: "pixi-svelte/ReverseMask",
		args: {
			x: 50,
			y: 50,
			zIndex: 1,
			isMask: false,
		}
	});
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp assets={{}}>
			<Rectangle width={200} height={200} backgroundColor={0xd32133}	/>
			<Container filters={[new PIXI.AlphaFilter()]}>
				<Rectangle width={100} height={100} backgroundColor={0x732133}	/>
				<Circle {...args} diameter={50} backgroundColor={0x000000} blendMode="erase" />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
