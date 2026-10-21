<script lang="ts" module>
	import * as PIXI from 'pixi.js';
	import { Tween } from 'svelte/motion';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Rectangle, Text } from 'pixi-svelte';
	import { waitForTimeout } from 'utils-shared/wait';

	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/Rectangle",
		component: Rectangle,
		args: {
			width: 100,
			height: 100,
			alpha: 0.9,
			borderWidth: 2,
			backgroundColor: 0x522000,
			borderColor: 0x1dc000,
			borderRadius: 0.5,
			x: 50,
			y: 50,
			zIndex: 1,
			isMask: false,
		}
	});
</script>

<script lang="ts">
	const filter = new PIXI.BlurFilter({ strength: 20 });
	const dynamicWidth = new Tween(50);

	const updateDynamicWidth = async () => {
		await dynamicWidth.set(dynamicWidth.current === 100 ? 50 : 100, { duration: 1000 });
		updateDynamicWidth();
	};

	updateDynamicWidth();

	let dynamicSizes = $state({
		width: 50,
		height: 50,
	});

	const updateDynamicSizes = async () => {
		await waitForTimeout(1000);
		dynamicSizes.width = dynamicSizes.width === 100 ? 50 : 100;
		// dynamicSizes.height = dynamicSizes.height === 100 ? 50 : 100;
		updateDynamicSizes();
	};

	updateDynamicSizes();

	const sharedStyle = {
		borderRadius: 10,
		backgroundColor: 0x000000,
		backgroundAlpha: 0.8,
		borderColor: 0xffffff,
		borderWidth: 10,
		borderAlpha: 0.8,
	};
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp assets={{}}>
			<Text {...args} text="hello world" />
			<Rectangle {...args} filters={[filter]} />
		</StoryPixiApp>
	{/snippet}
</Story>

<Story name="Resize">
	{#snippet template()}
		<StoryPixiApp assets={{}}>
			<Rectangle {...sharedStyle} width={50} height={50} />
			<Rectangle {...sharedStyle} y={60} width={dynamicWidth.current} height={50} />
			{#key dynamicSizes.width}
				<Rectangle {...sharedStyle} y={60 * 2} width={dynamicSizes.width} height={dynamicSizes.height} />
			{/key}
			<Rectangle {...sharedStyle} y={60 * 4} width={dynamicSizes.width} height={dynamicSizes.height} />
			<Rectangle {...sharedStyle} y={60 * 3} {...dynamicSizes} />
		</StoryPixiApp>
	{/snippet}
</Story>

