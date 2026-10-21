<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type Props = { children: Snippet };
</script>

<script lang="ts">
	import * as PIXI from 'pixi.js';

	import { getContextSpine, setContextSpineEventEmitter } from '../context.svelte';

	const props: Props = $props();
	const spine = getContextSpine();
	const spineEventEmitter = new PIXI.EventEmitter();

	spine.beforeUpdateWorldTransforms = () => spineEventEmitter.emit('beforeUpdateWorldTransforms');
	spine.afterUpdateWorldTransforms = () => spineEventEmitter.emit('afterUpdateWorldTransforms');

	setContextSpineEventEmitter(spineEventEmitter);
</script>

{@render props.children()}
