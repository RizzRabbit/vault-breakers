<script lang="ts">
	import { fade } from 'svelte/transition';

	import { waitForTimeout } from 'utils-shared/wait';

	import LoaderImage from './LoaderImage.svelte';

	type Props = {
		maxWidth: number;
		backgroundColor: string;
		timeout: number;
		src: string;
		oncomplete?: () => void;
	};

	const props: Props = $props();

	let loading = $state(true);
</script>

{#if loading}
	<div class="wrap" transition:fade style="--wrap-background: {props.backgroundColor};">
		<div class="gif-loader-wrap" style="--loader-wrap-background: {props.backgroundColor};">
			<LoaderImage
				maxWidth={props.maxWidth}
				src={props.src}
				onload={async () => {
					await waitForTimeout(props.timeout);
					loading = false;
					props.oncomplete?.();
				}}
			/>
		</div>
	</div>
{/if}

<style lang="scss">
	.wrap {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: black;
		overflow: hidden;
		background-color: var(--wrap-background);
	}

	.gif-loader-wrap {
		background-color: var(--loader-wrap-background);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
