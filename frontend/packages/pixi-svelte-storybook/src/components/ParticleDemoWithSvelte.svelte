<script lang="ts">
	import * as PIXI from 'pixi.js';

	import { getContextApp, type LoadedSprite, getContextParticleParent } from 'pixi-svelte';

	type Props = {
		size: number;
		boundary: { width: number; height: number };
	};

	const props: Props = $props();

	const particleContainer = getContextParticleParent();
	const context = getContextApp();
	const key = 'maggot';
	const texture = $derived(context.stateApp.loadedAssets[key]) as LoadedSprite;

	const createDude = () => {
		const dude = new PIXI.Particle(texture);

		// Set the anchor point so the texture is centerd on the sprite
		dude.anchorX = 0.5;
		dude.anchorY = 0.5;

		// Different maggots, different sizes
		dude.scaleX = 0.8 + Math.random() * 0.3;
		dude.scaleY = 0.8 + Math.random() * 0.3;

		// Scatter them all
		dude.x = Math.random() * props.boundary.width;
		dude.y = Math.random() * props.boundary.height;

		dude.tint = Math.random() * 0x808080;

		// Create a random direction in radians
		dude.direction = Math.random() * Math.PI * 2;

		// This number will be used to modify the direction of the sprite over time
		dude.turningSpeed = Math.random() - 0.8;

		// Create a random speed between 0 - 2, and these maggots are slooww
		dude.speed = (2 + Math.random() * 2) * 0.2;

		dude.offset = Math.random() * 100;

		particleContainer.addParticle(dude);

		return dude;
	};

		// Create a bounding box box for the little maggots
		const dudeBoundsPadding = 100;
		const dudeBounds = new PIXI.Rectangle(
			-dudeBoundsPadding,
			-dudeBoundsPadding,
			props.boundary.width + dudeBoundsPadding * 2,
			props.boundary.height + dudeBoundsPadding * 2,
		);

	type Dude = ReturnType<typeof createDude>;
	let dudes = $state<Dude[]>(Array(props.size).fill(undefined));
	const init = () => (dudes = dudes.map(() => createDude()));
	init();

	const updateDude = (index: number) => {
		const dude = dudes[index];
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

	let tick = 0;
	if(context.stateApp.pixiApplication) {
		context.stateApp.pixiApplication.ticker.add(() => {
			dudes.forEach((_, index) => updateDude(index));
			particleContainer.update();
	
			// Increment the ticker
			tick += 0.1;
		});
	}
</script>
