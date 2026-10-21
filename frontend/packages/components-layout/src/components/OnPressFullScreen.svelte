<script lang="ts">
	import CanvasSizeRectangle from './CanvasSizeRectangle.svelte';

	type Props = {
		onpress: () => void;
	};

	const props: Props = $props();
</script>

<CanvasSizeRectangle
	onpointerup={props.onpress}
	cursor="pointer"
	eventMode="static"
	backgroundColor={0xffffff}
	backgroundAlpha={0.001}
/>
