<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { StoryPixiApp } from 'components-storybook';

	import {
		SpineProvider,
		SpineTrack,
	} from 'pixi-svelte';

	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/MultipleImages", // There are multiple images in https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/multi-img-spine
		args: {
			width: 50,
			x: 500,
			y: 500,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		multi: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/multi-img-spine/lol_fs_screen.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/multi-img-spine/lol_fs_screen.atlas',
			}
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpineProvider key="multi" {...args}>
				<SpineTrack trackIndex={0} animationName="fs_won_intro" loop />
			</SpineProvider>
		</StoryPixiApp>
	{/snippet}
</Story>
