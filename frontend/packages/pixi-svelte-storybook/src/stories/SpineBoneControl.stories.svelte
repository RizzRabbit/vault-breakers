<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { SpineProvider } from 'pixi-svelte';

	import MousePositionProvider from '../components/MousePositionProvider.svelte';
	import { StoryPixiApp } from 'components-storybook';

	import {
		SpineTrack,
		SpineBone,
	} from 'pixi-svelte';


	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/BoneControl",
		args: {
			width: 10,
			x: 600,
			y: 400,
			zIndex: 1,
			timeScale: 1,
			boneName: 'ALL_Mover',
		}
	});

	const assets = {
		fox: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/fox/fox.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/fox/fox.atlas',
			},
		},
		tracks: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/tracks/feature_background.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/tracks/feature_background.atlas',
			},
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpineProvider key="tracks" x={600} y={400} width={2000}>
				<SpineTrack trackIndex={0} animationName="idle" loop />
			</SpineProvider>
			<MousePositionProvider>
				{#snippet children({ x, y })}
					{@const ratio = 100 / args.width}
					<SpineProvider key="fox" {...args}>
						<SpineTrack trackIndex={0} animationName="animation" loop />
						<SpineBone boneName={args.boneName} x={ratio * (x - args.x) - 1000} y={ratio * (y - args.y)} />
					</SpineProvider>
				{/snippet}
			</MousePositionProvider>
		</StoryPixiApp>
	{/snippet}
</Story>
