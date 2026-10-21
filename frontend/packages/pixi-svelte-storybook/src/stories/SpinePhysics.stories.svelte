<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { StoryPixiApp } from 'components-storybook';

	import {
		SpineProvider,
		SpineTrack,
	} from 'pixi-svelte';

	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/Physics",
		args: {
			width: 600,
			x: 300,
			y: 300,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		physics: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/physics-spine/cg_bg.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/physics-spine/cg_bg.atlas',
			}
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpineProvider key="physics" {...args}>
				<SpineTrack trackIndex={0} animationName="hidebonus" loop />
				<SpineTrack trackIndex={1} animationName="base_burst_land" loop />
			</SpineProvider>
		</StoryPixiApp>
	{/snippet}
</Story>
