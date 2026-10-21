<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { App, Text } from 'pixi-svelte';
	import { StoryPixiApp } from 'components-storybook';

	const { Story } = defineMeta({
		title: "pixi-svelte/App",
		component: App,
	});
</script>

<Story name="Preview">
	{#snippet template()}
		<StoryPixiApp assets={{}}>
			<Text text="App" style={{ fill: 0x000000 }} />
		</StoryPixiApp>
	{/snippet}
</Story>
