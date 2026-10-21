<script lang="ts">
	// Studio splash: pure HTML overlay on top of the canvas. Asset loading
	// continues underneath in parallel; no game state is touched.
	import { onMount } from 'svelte';

	let visible = $state(true);
	let leaving = $state(false);

	onMount(() => {
		const hold = new URLSearchParams(location.search).get('splashHold');
		if (hold) return; // debug: keep splash on screen
		const t1 = setTimeout(() => (leaving = true), 2600);
		const t2 = setTimeout(() => (visible = false), 3300);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	});
</script>

{#if visible}
	<div class="splash" class:leaving aria-hidden="true">
		<div class="inner">
			<img src="./assets/rizzin_games_mark.png" alt="Rizzin Games" />
			<div class="name">RIZZIN GAMES</div>
		</div>
	</div>
{/if}

<style>
	.splash {
		position: fixed;
		inset: 0;
		z-index: 10000;
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.7s ease;
		pointer-events: auto;
	}
	.splash.leaving {
		opacity: 0;
		pointer-events: none;
	}
	.inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		animation: splashIn 0.8s ease-out both;
	}
	img {
		height: min(42vh, 60vw);
		width: auto;
		filter: drop-shadow(0 0 2vmin rgba(212, 175, 55, 0.25));
	}
	.name {
		margin-top: 2.5vmin;
		font-family: 'Helvetica Neue', Arial, sans-serif;
		font-weight: 600;
		font-size: max(12px, 2.4vmin);
		letter-spacing: 0.45em;
		padding-left: 0.45em;
		background: linear-gradient(180deg, #f5f5f5 0%, #c0c0c0 45%, #d4af37 100%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	@keyframes splashIn {
		from {
			opacity: 0;
			transform: scale(0.92);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
