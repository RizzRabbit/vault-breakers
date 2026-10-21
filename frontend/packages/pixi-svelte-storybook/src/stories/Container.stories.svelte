<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { Container } from 'pixi-svelte';

	import { StoryPixiApp } from 'components-storybook';

	import {
		BitmapText,
		Sprite,
		SpineProvider,
		SpineTrack,
		Text,
	} from 'pixi-svelte';

	const { Story } = defineMeta({
		tags: ['autodocs'],
		title: "pixi-svelte/Container",
		component: Container,
		args: {
			x: 300,
			y: 300,
			zIndex: 1,
			pivot: { x: 0, y: 0 },
			rotation: 3.14,
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
			}
		},
		sprites: {
			type: 'sprites',
			src: 'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/sprites/sprites.json',
		},
		font: {
			type: 'font',
			src: 'https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/pixi-svelte-package/font/desyrel.xml',
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container {...args}>
				<BitmapText
					text="HELLO WORLD!"
					style={{
						fontFamily: 'Desyrel',
						fontSize: 50,
						letterSpacing: 0,
					}}
				/>
				<Text text="Hello World" style={{ fill: 0x000000 }} />
				<Sprite key="logo.png" width={300} height={200} />
				<SpineProvider width={100} key="guitar">
					<SpineTrack trackIndex={0} animationName="transition_loop" loop />
				</SpineProvider>
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
