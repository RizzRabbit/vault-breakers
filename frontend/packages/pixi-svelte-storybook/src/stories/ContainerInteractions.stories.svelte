<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { StoryPixiApp } from 'components-storybook';

	import {
		Container,
		SpineProvider,
		SpineTrack,
		Rectangle,
	} from 'pixi-svelte';

	const { Story } = defineMeta({
		title: "pixi-svelte/Container Interactions",
		args: {
			width: 250,
			x: 300,
			y: 500,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		spineBoy: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-pixi-examples/spineboy-pro.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-pixi-examples/spineboy-pma.atlas',
			},
		},
	} as const;

	let track = $state('walk');
	let tint = $state(0xffffff);
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container>
				<Rectangle
					width={50}
					height={50}
					cursor="cell"
					eventMode="static"
					backgroundColor={0x000000}
					onclick={() => alert('hi')}
				/>

				<Container
					eventMode="static"
					cursor="pointer"
					onclick={() => console.log('click!')}
					onpointerdown={() => (tint = Math.floor(Math.random() * 16777215))}
					onpointerenter={() => (track = 'run')}
					onpointerleave={() => (track = 'walk')}
				>
					<SpineProvider key="spineBoy" {...args} {tint}>
						<SpineTrack trackIndex={0} animationName={track} loop />
					</SpineProvider>
				</Container>
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
