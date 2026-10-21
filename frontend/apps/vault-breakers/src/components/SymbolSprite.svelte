<script lang="ts">
	import { Sprite } from 'pixi-svelte';
	import { onDestroy, untrack } from 'svelte';

	import { getSymbolInfo } from '../game/utils';
	import { SYMBOL_SIZE } from '../game/constants';
	import type { SymbolState } from '../game/types';

	type Props = {
		x?: number;
		y?: number;
		state?: SymbolState;
		symbolInfo: ReturnType<typeof getSymbolInfo>;
		oncomplete?: () => void;
	};

	const props: Props = $props();

	// Static Vault Breakers art. Win = scale pulse + additive glow, explosion = pop and fade,
	// land = small bounce. oncomplete is called exactly once per (state, symbol) run: if a new run
	// starts (same position re-animated) or the sprite unmounts before the effect ends, the pending
	// callback is flushed immediately instead of being dropped.
	const DURATION: Partial<Record<SymbolState, number>> = { win: 450, explosion: 300, land: 180 };

	let scale = $state(1);
	let alpha = $state(1);
	let glow = $state(0);
	let raf = 0;
	let pending: (() => void) | undefined;

	const flush = () => {
		const done = pending;
		pending = undefined;
		done?.();
	};

	const run = (state: SymbolState | undefined, done?: () => void) => {
		cancelAnimationFrame(raf);
		// same callback re-armed: keep it pending (called once at the end); otherwise flush the old one
		if (pending !== done) flush();
		else pending = undefined;
		scale = 1;
		alpha = 1;
		glow = 0;
		const duration = state ? DURATION[state] : undefined;
		if (!duration) {
			done?.();
			return;
		}
		pending = done;
		// mock/e2e only: record win-highlight starts to check ordering against step-ups
		const g = globalThis as any;
		if (state === 'win' && g.__VB_MOCK_RGS__) (g.__VB_WINS__ ??= []).push({ event: g.__VB_LAST_EVENT__, t: performance.now() + duration });
		const start = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			if (state === 'win') {
				const p = Math.sin(t * Math.PI);
				scale = 1 + 0.16 * p;
				glow = 0.75 * p;
			} else if (state === 'explosion') {
				scale = 1 + 0.35 * t;
				alpha = 1 - t;
				glow = 0.8 * (1 - t);
			} else {
				scale = 1 - 0.08 * Math.sin(t * Math.PI);
			}
			if (t < 1) raf = requestAnimationFrame(step);
			else {
				if (state !== 'explosion') {
					scale = 1;
					glow = 0;
				}
				flush();
			}
		};
		raf = requestAnimationFrame(step);
	};

	$effect(() => {
		const state = props.state;
		const done = props.oncomplete;
		untrack(() => run(state, done));
	});

	onDestroy(() => {
		cancelAnimationFrame(raf);
		flush();
	});

	const width = $derived(SYMBOL_SIZE * props.symbolInfo.sizeRatios.width * scale);
	const height = $derived(SYMBOL_SIZE * props.symbolInfo.sizeRatios.height * scale);
</script>

<Sprite x={props.x} y={props.y} anchor={0.5} key={props.symbolInfo.assetKey} {width} {height} {alpha} />
{#if glow > 0}
	<Sprite
		x={props.x}
		y={props.y}
		anchor={0.5}
		key={props.symbolInfo.assetKey}
		width={width * 1.04}
		height={height * 1.04}
		alpha={glow}
		blendMode="add"
		tint={0x7ff7ec}
	/>
{/if}
