<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { StoryPixiApp } from 'components-storybook';

	import {
		SpineProvider,
		SpineTrack,
		Sprite,
		SpineSlot,
	} from 'pixi-svelte';

	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/SpineProvider",
		args: {
			width: 250,
			x: 300,
			y: 100,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		guitar: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/guitar/transition_char.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/guitar/transition_char.atlas',
			},
		},
		sprites: {
			type: 'sprites',
			src: 'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/sprites/sprites.json',
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpineProvider {...args} key="guitar">
				<SpineTrack trackIndex={0} animationName="transition_loop" loop />
				<SpineSlot slotName="stage_cloud">
					<Sprite key="logo.png" width={500} height={500} />
				</SpineSlot>
				<SpineSlot slotName="stage_light_a_beam_1">
					<Sprite key="logo.png" width={500} height={500} />
				</SpineSlot>
			</SpineProvider>
			<Sprite x={args.x + args.width} key="logo.png" width={500} height={500} />
		</StoryPixiApp>
	{/snippet}
</Story>
