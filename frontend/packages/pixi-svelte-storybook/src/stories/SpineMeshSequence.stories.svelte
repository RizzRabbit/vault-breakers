<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import {
		SpineProvider,
		SpineTrack,
	} from 'pixi-svelte';

	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/MeshSequence",
		args: {
			width: 250,
			x: 200,
			y: 300,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		spineMeshSequence: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-mesh-sequence/meshsequence.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-mesh-sequence/meshsequence.atlas',
			},
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpineProvider {...args} key="spineMeshSequence">
				<SpineTrack trackIndex={0} animationName="animation" loop />
			</SpineProvider>
		</StoryPixiApp>
	{/snippet}
</Story>
