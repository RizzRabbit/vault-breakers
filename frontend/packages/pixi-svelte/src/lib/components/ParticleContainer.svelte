<script lang="ts" module>
	import * as PIXI from 'pixi.js';
	import type { Snippet } from 'svelte';

	import type { OverwriteCursor } from '../types';

	export type Props = OverwriteCursor<PIXI.ParticleContainerOptions> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	import { propsSyncEffect } from '../utils.svelte';
	import { getContextParent, setContextParticleParent } from '../context.svelte';

	const props: Props = $props();
	const parentContext = getContextParent();
	const particleContainer = new PIXI.ParticleContainer();

	propsSyncEffect({ props, target: particleContainer, ignore: ['children'] });
	parentContext.addToParent(particleContainer);
	setContextParticleParent(particleContainer);
</script>

{@render props.children()}
