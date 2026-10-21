<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { StoryPixiApp } from 'components-storybook';

	import {
		SpineProvider,
		SpineEventEmitterProvider,
		SpineTrack,
		Sprite,
		SpineSlot,
	} from 'pixi-svelte';

	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/SpineSlotSyncWithAttachment",
		args: {
			width: 250,
			x: 300,
			y: 100,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		spineSlotSync: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-slot-sync-attachment/slot-sync-attachment.json',
				atlas: 'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-slot-sync-attachment/slot-sync-attachment.atlas',
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
			<SpineProvider {...args} key="spineSlotSync">
				<SpineTrack trackIndex={0} animationName="attachmentOnOff" loop />
				<SpineEventEmitterProvider>
					<SpineSlot slotName="slot_sync">
						<Sprite key="logo.png" width={500} height={500} />
					</SpineSlot>
					<SpineSlot slotName="slot_sync2">
						<Sprite key="logo.png" width={500} height={500} />
					</SpineSlot>
				</SpineEventEmitterProvider>
			</SpineProvider>
			<Sprite x={args.x + args.width} key="logo.png" width={500} height={500} />
		</StoryPixiApp>
	{/snippet}
</Story>
