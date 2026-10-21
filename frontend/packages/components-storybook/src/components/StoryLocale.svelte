<script lang="ts">
	import { i18n } from "@lingui/core";
	import { onMount, type Snippet } from "svelte";

	import { type Language } from 'state-shared';

	type Props = {
		lang: Language;
		children: Snippet;
	};

	const props: Props = $props();

	onMount(async () => {
		i18n.load('en', {});
		i18n.activate('en');
	});
</script>

{@render props.children()}
