<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setContextBoard } from '../context';

	type Props = {
		animate: boolean;
		children: Snippet;
	};

	const props: Props = $props();

	setContextBoard({ animate: props.animate });
</script>

{@render props.children()}
