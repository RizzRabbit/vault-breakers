<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { StoryPixiApp } from 'components-storybook';

	import { SpineProvider, SpineTrack } from 'pixi-svelte';

	const ANIMATION_NAME_LIST = [
		'aim',
		'death',
		'hoverboard',
		'idle',
		'idle-turn',
		'jump',
		'portal',
		'run',
		'run-to-idle',
		'shoot',
		'walk',
	];

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/Spine/SpineBoy",
		component: SpineTrack,
		argTypes: {
			animationName: { control: 'radio', options: ANIMATION_NAME_LIST },
		},
		args: {
			alpha: 1,
			loop: true,
			trackIndex: 0,
			mixDuration: 0,
			animationName: 'walk',
		},
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

	const spineProps = {
		width: 250,
		x: 300,
		y: 500,
		zIndex: 1,
		anchor: { x: 0, y: 0 },
	};
</script>

<Story name="Preview">
	{#snippet template(args)}
		{@const props = { ...args, trackIndex: args.trackIndex ?? 0, animationName: args.animationName ?? '' }}
		<StoryPixiApp {assets}>
			<SpineProvider key="spineBoy" {...spineProps}>
				<SpineTrack {...props} listener={{
					event: (track, event) => {
						if(event.data.name) console.log(`animation ${track.animation?.name} triggers event ${event.data.name}`)
					},
					complete: (track) => console.log(`animation ${track.animation?.name} is completed`),
				}} />
			</SpineProvider>
		</StoryPixiApp>
	{/snippet}
</Story>
