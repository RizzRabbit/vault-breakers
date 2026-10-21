<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Sprite } from 'pixi-svelte';

	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/Sprite",
		component: Sprite,
		args: {
			x: 50,
			y: 50,
			width: 200,
			height: 200,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		},
	});
</script>

<Story name="From Sprite">
	{#snippet template(args)}
		<StoryPixiApp assets={{
			sprite: { type: 'sprite', src: 'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/fighter/fighter.png' },
		}}>
			<Sprite {...args} key="sprite" />
		</StoryPixiApp>
	{/snippet}
</Story>

<Story name="From Sprites">
	{#snippet template(args)}
		<StoryPixiApp assets={{
			sprites: { type: 'sprites', src: 'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/sprites/sprites.json' },
		}}>
			<Sprite {...args} key="reels.png" />
		</StoryPixiApp>
	{/snippet}
</Story>
