<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { BitmapText } from 'pixi-svelte';
	import { StoryPixiApp } from 'components-storybook';

	const allText = 'BIT MAP FONTS ARE SUPPORTED!\nWOO YAY!';

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/BitmapText",
		component: BitmapText,
		args: {
			x: 0,
			y: 0,
			zIndex: 1,
			text: allText,
			style: {
				fontFamily: 'clash_font_white',
				fontSize: 50,
				letterSpacing: 0,
				fill: 0xffffff,
			},
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		font: { type: 'font', src: 'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/font/clash_font_white.xml' },
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<BitmapText {...args} />
		</StoryPixiApp>
	{/snippet}
</Story>
