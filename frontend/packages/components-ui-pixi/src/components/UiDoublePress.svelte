<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';

	type Props = {
		onpressSingle: () => void;
		onpressDouble: () => void;
		children: Snippet<[{ onpress: () => void }]>;
	};

	const props: Props = $props();
	const DOUBLE_PRESS_TIMEOUT = 150;

	let pressingTimes = $state(0);
	let timeout: number = 0;

	const increasePressTimes = () => {
		pressingTimes = pressingTimes + 1;
	};

	const clearPressTimes = () => {
		pressingTimes = 0;
	};

	const onpress = async () => {
		clearTimeout(timeout);
		props.onpressSingle();
		increasePressTimes();
		setTimeout(clearPressTimes, DOUBLE_PRESS_TIMEOUT);
	};

	$effect(() => {
		if (pressingTimes >= 2) {
			props.onpressDouble();
			clearPressTimes();
			clearTimeout(timeout);
		}
	});

	onDestroy(() => {
		clearTimeout(timeout);
	});
</script>

{@render props.children({ onpress })}
