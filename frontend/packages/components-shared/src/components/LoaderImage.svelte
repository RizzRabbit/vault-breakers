<script lang="ts">
	type Props = {
		src: string;
		maxWidth: number;
		onload: () => void;
	};

	const props: Props = $props();
</script>

<img
	style="--max-width-value: {props.maxWidth}px"
	src={props.src}
	alt="loader"
	class="loader"
	draggable="false"
	onload={props.onload}
/>

<style lang="scss">
	.loader {
		width: 100%;
		max-width: var(--max-width-value);
	}
</style>
