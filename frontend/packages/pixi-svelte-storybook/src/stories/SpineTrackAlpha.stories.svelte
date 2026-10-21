<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Tween } from 'svelte/motion';
	import { backInOut } from 'svelte/easing';

	import { StoryPixiApp } from 'components-storybook';

	import { SpineProvider, SpineTrack, Text } from 'pixi-svelte';

	const { Story } = defineMeta({
		title: 'pixi-svelte/Spine/SpineTrackAlpha',
		args: {
			width: 850,
			x: 300,
			y: 400,
			zIndex: 1,
			anchor: { x: 0, y: 0 },
		},
	});
</script>

<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const assets = {
		reelhouse: {
			type: 'spine',
			src: {
				skeleton:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/1-5-realm-of-rats/spines/reelhouse/reelhouse.json',
				atlas:
					'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/1-5-realm-of-rats/spines/reelhouse/reelhouse.atlas',
			},
		},
	} as const;

	const pinkTrackAlpha = new Tween(1, { duration: 600, easing: backInOut });
	const blueTrackAlpha = new Tween(0, { duration: 600, easing: backInOut });
	const yellowTrackAlpha = new Tween(0, { duration: 600, easing: backInOut });
	const trackAlphas = [pinkTrackAlpha, blueTrackAlpha, yellowTrackAlpha];

	const clickHandler = async () => {
		const complete = trackAlphas.find((alpha) => alpha.current !== 0);
		if (!complete) return;

		const availableTracks = trackAlphas.filter((alpha) => alpha.current === 0);
		const chosenTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];

		const currentTrack = trackAlphas.find((alpha) => alpha.current === 1);

		if (currentTrack) currentTrack.set(0);
		chosenTrack.set(1);
	};
	
	onMount(() => window.addEventListener('click', clickHandler));
	onDestroy(() => window.removeEventListener('click', clickHandler));
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Text text="CLICK TO RANDOMLY MOVE PIPE WITH ALPHA EASING" />
			<SpineProvider {...args} key="reelhouse">
				<SpineTrack trackIndex={0} animationName="bonus_idle" loop />
				<SpineTrack trackIndex={1} animationName="pipe_pink" alpha={pinkTrackAlpha.current} />
				<SpineTrack trackIndex={2} animationName="pipe_blue" alpha={blueTrackAlpha.current} />
				<SpineTrack trackIndex={3} animationName="pipe_yellow" alpha={yellowTrackAlpha.current} />
			</SpineProvider>
		</StoryPixiApp>
	{/snippet}
</Story>
