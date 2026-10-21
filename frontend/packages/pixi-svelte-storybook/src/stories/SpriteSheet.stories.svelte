<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { SpriteSheet } from 'pixi-svelte';

	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/SpriteSheet (AnimatedSprite)",
		component: SpriteSheet,
		args: {
			width: 100,
			height: 100,
			x: 50,
			y: 50,
			zIndex: 1,
			play: true,
			anchor: { x: 0, y: 0 },
			animationSpeed: 1,
		},
	});

	const assets = {
		fighter: {
			type: "spriteSheet",
			src: "https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/fighter/fighter.json",
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpriteSheet {...args} key="fighter" loop />
		</StoryPixiApp>
	{/snippet}
</Story>
