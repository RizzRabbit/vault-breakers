<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { StoryEventEmitter } from 'components-storybook';

	import EnableHotkey from '../components/EnableHotkey.svelte';
	import EnableSpaceHold from '../components/EnableSpaceHold.svelte';

	const { Story } = defineMeta({
		title: 'EnableSpaceHold',
		args: {},
	});
</script>

<script lang="ts">
	import { stateBet } from 'state-shared';

	const test = $derived({
		autoSpinsCounter: stateBet.autoSpinsCounter,
		isSpaceHold: stateBet.isSpaceHold,
		isTurbo: stateBet.isTurbo,
	});
</script>

<Story name="Preview">
	{#snippet template()}
		<StoryEventEmitter>
			<div>{JSON.stringify(test, undefined, 2)}</div>
			<EnableHotkey />
			<EnableSpaceHold />
		</StoryEventEmitter>
	{/snippet}
</Story>
