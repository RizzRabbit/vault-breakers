<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import {
		Text,
		SpineProvider,
		SpineTrack,
	} from 'pixi-svelte';
	import { waitForTimeout } from 'utils-shared/wait';

	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		title: "pixi-svelte/Spine/SpineTracks",
		args: {
			width: 1500,
			x: 550,
			y: 250,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		}
	});

	const assets = {
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

	let track1: undefined | string = $state(undefined);
	let track2: undefined | string = $state(undefined);
	let track3: undefined | string = $state('fog');
	let track4: undefined | string = $state(undefined);
	let loop1 =	$state(true);
	let mixDuration2 =	$state(5);
	let timeScale4 =	$state(1);

	const ROTATION_TIMEOUT = 6000;

	const rotateTracks = async () => {
		track1 = 'idle';
		track4 = 'rain';
		await waitForTimeout(ROTATION_TIMEOUT);
		timeScale4 = 10;
		track2 = 'lightning';
		await waitForTimeout(ROTATION_TIMEOUT);
		track1 = undefined;
		track4 = undefined;
	};

	rotateTracks();

	const tracks = $derived({
		track1: track1 ?? 'undefined',
		track2: track2 ?? 'undefined',
		track3: track3 ?? 'undefined',
		track4: track4 ?? 'undefined',
	});
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<SpineProvider {...args} key="tracks">
				{#if track1}
					<SpineTrack trackIndex={1} animationName={track1} loop={loop1} />
				{/if}
				{#if track2}
					<SpineTrack trackIndex={2} animationName={track2} mixDuration={mixDuration2} />
				{/if}
				{#if track3}
					<SpineTrack trackIndex={3} animationName={track3} loop />
				{/if}
				{#if track4}
					<SpineTrack trackIndex={9} animationName={track4} loop timeScale={timeScale4} />
				{/if}
			</SpineProvider>
			<Text text={JSON.stringify(tracks, undefined, 2)} style={{ fill: 0x000000 }} />
		</StoryPixiApp>
	{/snippet}
</Story>
