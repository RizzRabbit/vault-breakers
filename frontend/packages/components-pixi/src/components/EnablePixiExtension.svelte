<script lang="ts">
	import { getContextApp } from 'pixi-svelte';

	const context = getContextApp();

	// @ts-ignore
	globalThis.__PIXI_APP__ = context.stateApp.pixiApplication;
</script>
