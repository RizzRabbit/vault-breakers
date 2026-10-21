<script lang="ts" module>
	import * as PIXI from 'pixi.js';

	export type Props = { slotName: string; children: Snippet };
</script>

<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import {
		getContextSpine,
		createContextParent,
		getContextSpineEventEmitter,
	} from '../context.svelte';

	const props: Props = $props();
	const spine = getContextSpine();
	const slotContainer = new PIXI.Container();
	const spineEventEmitter = getContextSpineEventEmitter();

	let show = $state(!Boolean(spineEventEmitter));

	onMount(() => {
		if (spineEventEmitter) {
			spineEventEmitter.on('beforeUpdateWorldTransforms', () => {
				const slot = spine.skeleton.findSlot(props.slotName);

				if (slot) {
					show = Boolean(slot?.attachment);
				}
			});
		}

		spine.addSlotObject(props.slotName, slotContainer);
	});

	createContextParent(slotContainer);
</script>

{#if show}
	{@render props.children()}
{/if}
