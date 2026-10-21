<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		type: 'full-width' | 'max-width';
		children: Snippet;
	};

	const props: Props = $props();
</script>

<div class="ui-modal-button-wrap">
	<div class={props.type}>
		{@render props.children()}
	</div>
</div>

<style lang="scss">
	.ui-modal-button-wrap {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.full-width {
		width: 100%;
	}

	.max-width {
		width: 100%;
		max-width: 250px;
	}
</style>
