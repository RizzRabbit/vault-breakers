<script lang="ts">
	import type { Snippet } from 'svelte';

	import { waitForResolve } from 'utils-shared/wait';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../context';

	type Props = {
		children: Snippet;
	};

	const props: Props = $props();
	const context = getContext();

	let show = $state(true);
	let oncomplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		uiShow: async () => {
			if (show === false) {
				show = true;
				await waitForResolve((resolve) => (oncomplete = resolve));
			}
		},
		uiHide: async () => {
			if (show === true) {
				show = false;
				await waitForResolve((resolve) => (oncomplete = resolve));
			}
		},
	});
</script>

<FadeContainer persistent {show} {oncomplete}>
	{@render props.children()}
</FadeContainer>
