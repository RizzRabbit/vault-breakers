<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		onmount: () => void;
	};

	const props: Props = $props();

	onMount(() => props.onmount());
</script>
