<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Text, Rectangle } from 'pixi-svelte';
	import { waitForTimeout } from 'utils-shared/wait';

	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/Text",
		component: Text,
		args: {
			x: 50,
			y: 50,
			zIndex: 1,
			text: "Hello world",
			style: { fill: 0x000000, fontWeight: "bold", fontSize: 30 },
			anchor: { x: 0, y: 0 },
			scale: { x: 1, y: 1 },
		},
	});
</script>

<script lang="ts">
	let textSizes = $state({ width: 0, height: 0 });

	let dynamicText = $state('abc');
	const updateDynamicText = async () => {
		await waitForTimeout(500);
		dynamicText = dynamicText === 'abc' ? 'abcdefg': 'abc';
		updateDynamicText();
	};

	updateDynamicText();
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp assets={{}}>
			<Rectangle x={args.x} y={args.y} {...textSizes} backgroundColor={0x500000} backgroundAlpha={0.5} />
			<Text
				{...args}
				cursor="pointer"
				eventMode="static"
				onclick={() => {
					alert('clicked')
				}}
				onresize={(value) => {
					textSizes = value;
				}}
			/>
			<Text text="abc" />
		</StoryPixiApp>
	{/snippet}
</Story>

<Story name="Onresize">
	{#snippet template()}
		<StoryPixiApp assets={{}}>
			{@const test = { width: textSizes.width }}
			<Rectangle width={test.width} height={50} backgroundColor={0x500000} backgroundAlpha={0.5} />
			<Text
				text={dynamicText}
				onresize={(value) => {
					textSizes = value;
				}}
			/>
		</StoryPixiApp>
	{/snippet}
</Story>
