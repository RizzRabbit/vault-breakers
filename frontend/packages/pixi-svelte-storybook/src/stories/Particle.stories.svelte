

<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import * as PIXI from 'pixi.js';

	import { ParticleContainer, Particles, Rectangle } from 'pixi-svelte';

	import ParticleDemoWithoutSvelte from '../components/ParticleDemoWithoutSvelte.svelte';
	import ParticleDemoWithSvelte from '../components/ParticleDemoWithSvelte.svelte';
	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		title: "pixi-svelte/Particle",
		component: ParticleContainer,
		args: {
			dynamicProperties: {
				position: true,	// Allow dynamic position changes (default)
				scale: true,		// Allow dynamic scale for extra performance
				rotation: true, // Allow dynamic rotation
				color: false		 // Static color
			},
		},
	});

	const assets = {
		maggot: { type: 'sprite', src: 'https://pixijs.com/assets/maggot_tiny.png' },
	} as const;

	const BOUNDARY = {
		width: 1000,
		height: 1000,
	} as const;

	const createDude = (dude: PIXI.Particle) => {
		// Set the anchor point so the texture is centerd on the sprite
		dude.anchorX = 0.5;
		dude.anchorY = 0.5;

		// Different maggots, different sizes
		dude.scaleX = 0.8 + Math.random() * 0.3;
		dude.scaleY = 0.8 + Math.random() * 0.3;

		// Scatter them all
		dude.x = Math.random() * BOUNDARY.width;
		dude.y = Math.random() * BOUNDARY.height;

		dude.tint = Math.random() * 0x808080;

		// Create a random direction in radians
		dude.direction = Math.random() * Math.PI * 2;

		// This number will be used to modify the direction of the sprite over time
		dude.turningSpeed = Math.random() - 0.8;

		// Create a random speed between 0 - 2, and these maggots are slooww
		dude.speed = (2 + Math.random() * 2) * 0.2;

		dude.offset = Math.random() * 100;
	};

	const dudeBoundsPadding = 100;
	const dudeBounds = new PIXI.Rectangle(
		-dudeBoundsPadding,
		-dudeBoundsPadding,
		BOUNDARY.width + dudeBoundsPadding * 2,
		BOUNDARY.height + dudeBoundsPadding * 2,
	);

	let tick = 0;

	const updateDude = (dude: PIXI.Particle) => {
		dude.scaleY = 0.95 + Math.sin(tick + dude.offset) * 0.05;
		dude.direction += dude.turningSpeed * 0.01;
		dude.x += Math.sin(dude.direction) * (dude.speed * dude.scaleY);
		dude.y += Math.cos(dude.direction) * (dude.speed * dude.scaleY);
		dude.rotation = -dude.direction + Math.PI;

		// Wrap the maggots
		if (dude.x < dudeBounds.x)
		{
				dude.x += dudeBounds.width;
		}
		else if (dude.x > dudeBounds.x + dudeBounds.width)
		{
				dude.x -= dudeBounds.width;
		}

		if (dude.y < dudeBounds.y)
		{
				dude.y += dudeBounds.height;
		}
		else if (dude.y > dudeBounds.y + dudeBounds.height)
		{
				dude.y -= dudeBounds.height;
		}
	};

	const SIZE = 10000;
</script>

<Story name="Demo without svelte">
	{#snippet template()}
		<ParticleDemoWithoutSvelte size={SIZE} />
	{/snippet}
</Story>

<Story name="Demo with partial svelte">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Rectangle
				{...BOUNDARY}
				backgroundAlpha={0}
				borderColor={0x000000}
				borderWidth={1}
				borderAlpha={1}
			/>
				<ParticleContainer {...args}>
					<ParticleDemoWithSvelte size={SIZE} boundary={BOUNDARY} />
				</ParticleContainer>
		</StoryPixiApp>
	{/snippet}
</Story>


<Story name="Particles Preview">
	{#snippet template(args)}
		<StoryPixiApp {assets}>
			<Rectangle
				{...BOUNDARY}
				backgroundAlpha={0}
				borderColor={0x000000}
				borderWidth={1}
				borderAlpha={1}
			/>
				<ParticleContainer {...args}>
					<Particles
						key="maggot"
						size={SIZE}
						init={(particles) => {
							particles.forEach(particle => createDude(particle));
						}}
						update={(particles) => {
							particles.forEach(particle => updateDude(particle));
							tick += 0.1;
						}}
					/>
				</ParticleContainer>
		</StoryPixiApp>
	{/snippet}
</Story>

