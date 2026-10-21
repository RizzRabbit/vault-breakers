<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import {
		Text,
		SpineProvider,
		SpineTrack,
	} from 'pixi-svelte';

	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/Events",
		args: {
			width: 30,
			x: 20,
			y: 200,
			zIndex: 1,
			timeScale: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
		spineEvents: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-events/events.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/spine-events/events.atlas',
			},
		},
	} as const;

	let onComplete = $state('not yet');
	let onCompleteTrack2 = $state('not yet');
	let onEvent = $state('not yet');
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpineProvider {...args} key="spineEvents">
				<SpineTrack
					trackIndex={0}
					animationName="baseTrack"
					loop
					listener={{
						event: (entry, event) => {
							onEvent = 'done!';
							console.log('spine event:', event.data.name, entry, event);
						},
						complete: (entry) => {
							onComplete = 'done!';
							console.log('complete event', entry);
						}
					}}
				/>
				<SpineTrack
					trackIndex={1}
					animationName="scaleTrack"
					loop
					listener={{
						complete: (entry) => {
							onCompleteTrack2 = 'done!';
							console.log('track2 complete event', entry);
						}
					}}
				/>
			</SpineProvider>
			<Text
				x={args.x}
				y={args.y + 200}
				text="oncomplete: {onComplete}"
				style={{ fill: 0x000000 }}
			/>
			<Text
				x={args.x}
				y={args.y + 300}
				text="oncompleteTrack2: {onCompleteTrack2}"
				style={{ fill: 0x000000 }}
			/>
			<Text x={args.x} y={args.y + 400} text="onevent: {onEvent}" style={{ fill: 0x000000 }} />
		</StoryPixiApp>
	{/snippet}

</Story>
