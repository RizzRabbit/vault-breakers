<script lang="ts" module>
	import * as PIXI from 'pixi.js';
	import type { Snippet } from 'svelte';

	import type { OverwriteCursor } from '../types';

	export type Props = OverwriteCursor<Omit<PIXI.ContainerOptions, 'children'>> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	import { propsSyncEffect } from '../utils.svelte';
	import { getContextParent, createContextParent } from '../context.svelte';

	const props: Props = $props();
	const parentContext = getContextParent();
	const container = new PIXI.Container();

	propsSyncEffect({ props, target: container, ignore: ['children'] });
	parentContext.addToParent(container);
	createContextParent(container);
</script>

{@render props.children()}
