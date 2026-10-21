<script lang="ts">
	import type { Snippet } from "svelte";

	import { createEventEmitter, setContextEventEmitter } from "utils-event-emitter";

	type Props = {
		children: Snippet;
	};

	const props: Props = $props();

	const context = createEventEmitter<any>();

	setContextEventEmitter(context);
</script>

{@render props.children()}
