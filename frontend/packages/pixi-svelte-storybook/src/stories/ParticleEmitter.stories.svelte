<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { ParticleEmitter, Container } from 'pixi-svelte';
	import { StoryPixiApp } from 'components-storybook';

	const fountainConfig = {
		alpha: {
			start: 1,
			end: 1,
		},
		scale: {
			start: 0.3,
			end: 0.4,
			minimumScaleMultiplier: 1,
		},
		color: {
			start: '#ffffff',
			end: '#ffffff',
		},
		speed: {
			start: 700,
			end: 800,
			minimumSpeedMultiplier: 1,
		},
		acceleration: {
			x: 0,
			y: 600,
		},
		maxSpeed: 0,
		startRotation: {
			min: 255,
			max: 285,
		},
		noRotation: false,
		rotationSpeed: {
			min: -90,
			max: 90,
		},
		lifetime: {
			min: 6,
			max: 6,
		},
		blendMode: 'normal',
		frequency: 0.1,
		emitterLifetime: -1,
		maxParticles: 100,
		pos: {
			x: 0,
			y: 0,
		},
		addAtBack: false,
		spawnType: 'rect',
		spawnRect: {
			x: -100,
			y: 0,
			w: 200,
			h: 0,
		}
	} as const;

	const { Story } = defineMeta({
		title: 'pixi-svelte/ParticleEmitter',
		component: ParticleEmitter,
		args: {
			x: 500,
			y: 500,
			config: fountainConfig,
		},
	});

	const assets = {
		maggot: { type: 'sprite', src: 'https://pixijs.com/assets/maggot_tiny.png' },
		coins: {
			type: 'spriteSheet',
			src: `https://test-twist-front-2.s3.ap-southeast-2.amazonaws.com/1-7-samurai-dogs-2/sprites/coin/SD2_Coin.json`,
		},
	} as const;
</script>

<Story name="Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Container {...args}>
				<ParticleEmitter key="coins" {...args} emit />
			</Container>
		</StoryPixiApp>
	{/snippet}
</Story>
