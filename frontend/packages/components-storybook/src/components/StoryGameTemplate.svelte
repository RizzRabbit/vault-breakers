<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	import { getContextApp } from 'pixi-svelte';
	import { getContextLayout } from 'utils-layout';

	type Props = {
		skipLoadingScreen: boolean;
		action: () => Promise<void>;
		children: Snippet;
	};

	const props: Props = $props();
	const appContext = getContextApp();
	const layoutContext = getContextLayout();

	let actionState = $state({
		running: false,
		message: 'Initialising...',
	});

	$effect(() => {
		if (appContext.stateApp.loaded) {
			layoutContext.stateLayout.showLoadingScreen = !props.skipLoadingScreen;
		}
	});

	$effect(() => {
		if (!layoutContext.stateLayout.showLoadingScreen) {
			actionState.message = "Click action to start";
		}
	});

	onMount(() => {
		actionState.running = false;
		actionState.message = 'Initialising...';

		return () => {
			layoutContext.stateLayout.showLoadingScreen = true;
			actionState.running = false;
			actionState.message = 'Initialising...';
		};
	});
</script>

{@render props.children()}

<div class="wrap">
	<button
		class="action"
		disabled={actionState.running || layoutContext.stateLayout.showLoadingScreen}
		onclick={async () => {
			actionState.running = true;
			actionState.message = "Running... (Make sure action is resolved eventually, or your game will get stuck)";
			await props.action();
			actionState.message = 'Action is resolved ✅';
			actionState.running = false;
		}}
	>
		Action
	</button>
	<span class="message">ⓘ {actionState.message}</span>
</div>

<style lang="scss">
	.wrap {
		position: absolute;
		top: 0;
		z-index: 999;
		display: flex;
		flex-direction: row;
	}

	.action {
		z-index: 2;
		border: none;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		cursor: pointer;
		background-color: green;
		border-radius: 5px;
		padding: 5px;
		color: white;
		font-size: 16px;
	}

	.action:disabled {
		background-color: lightgreen;
		cursor: not-allowed;
	}

	.message {
		margin-left: -10px;
		background-color: yellow;
		padding: 5px;
		padding-left: 15px;
		color: black;
		font-size: 16px;
	}
</style>