<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	import { StoryEventEmitter } from 'components-storybook';

	import EnableHotkey from '../components/EnableHotkey.svelte';
	import OnHotkey from '../components/OnHotkey.svelte';

	const { Story } = defineMeta({
		title: 'Hotkey',
		args: {},
	});
</script>

<script lang="ts">
	let disabled1 = $state(false);
	let disabled2 = $state(false);
</script>

<Story name="Preview">
	{#snippet template()}
		<StoryEventEmitter>
			<EnableHotkey />

			<div>disabled1: {disabled1}</div>

			<div>disabled2: {disabled2}</div>

			<OnHotkey
				disabled={disabled1}
				hotkey="Space"
				onpress={() => {
					console.log('onpress 1');
				}}
				onhold={() => {
					console.log('onhold 1');
				}}
				onpressend={() => {
					console.log('onpressend 1');
				}}
				onholdend={() => {
					console.log('onholdend 1');
				}}
			/>

			<OnHotkey
				disabled={disabled2}
				hotkey="Space"
				onpress={() => {
					console.log('onpress 2');
				}}
				onhold={() => {
					console.log('onhold 2');
					disabled1 = true;
				}}
				onpressend={() => {
					console.log('onpressend 2');
				}}
				onholdend={() => {
					console.log('onholdend 2');
					disabled1 = false;
				}}
			/>
		</StoryEventEmitter>
	{/snippet}
</Story>
