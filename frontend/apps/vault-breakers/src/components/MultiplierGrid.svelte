<script lang="ts" module>
	export type EmitterEventMultiplierGrid =
		| { type: 'multiplierGridShow' }
		| { type: 'multiplierGridHide' }
		| { type: 'multiplierGridUpdate'; grid: number[][] }
		| { type: 'multiplierGridClear' }
		| { type: 'multiplierGridHighlight'; reel: number; row: number };
</script>

<script lang="ts">
	import { BitmapText, Container, Rectangle, Sprite } from 'pixi-svelte';

	type Props = { layer: 'frames' | 'labels' };
	const props: Props = $props();

	// one look per spot-multiplier tier (frame art: mult_x{tier}.png)
	const TIERS = [2, 4, 8, 16, 32, 64, 128] as const;
	const TIER_COLORS: Record<number, number> = {
		2: 0xcd7f32, // bronze
		4: 0xcdd4e1, // silver
		8: 0xffc832, // gold
		16: 0x3ccd5a, // green
		32: 0x3c82ff, // blue
		64: 0xa550f5, // purple
		128: 0xf02828, // red (frame art has a glow)
	};
	const tierOf = (m: number) => TIERS.reduce((best, t) => (m >= t ? t : best), 2 as number);

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	const context = getContext();
	const DEFAULT_GRID = Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]);

	let show = $state(false);
	let grid = $state(DEFAULT_GRID);
	let highlight = $state<{ reel: number; row: number } | null>(null);
	let popping = $state<Set<string>>(new Set());
	let popScale = $state(1);
	let popRaf = 0;
	const startPop = (cells: Set<string>) => {
		cancelAnimationFrame(popRaf);
		popping = cells;
		const start = performance.now();
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / 420);
			const u = t < 0.35 ? t / 0.35 : (t - 0.35) / 0.65;
			popScale = 1 + 0.6 * (t < 0.35 ? 1 - Math.pow(1 - u, 3) * (1 - 1.7 * u) : 1 - (1 - Math.pow(1 - u, 3))); // backOut rise, cubicOut fall
			if (t < 1) popRaf = requestAnimationFrame(tick);
			else popping = new Set();
		};
		popRaf = requestAnimationFrame(tick);
	};

	// x128 spots: pulsing red glow (time-based, so it keeps its phase even at low frame rates)
	const has128 = $derived(props.layer === 'frames' && show && grid.some((reel) => reel.some((m) => m >= 128)));
	let glow = $state(0);
	$effect(() => {
		if (!has128) return;
		let raf = 0;
		const tick = (now: number) => {
			glow = 0.5 + 0.5 * Math.sin((now / 900) * Math.PI * 2);
			const g = globalThis as any;
			if (g.__VB_MOCK_RGS__) g.__VB_GLOW__ = glow; // mock/e2e only
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	context.eventEmitter.subscribeOnMount({
		multiplierGridShow: () => (show = true),
		multiplierGridHide: () => (show = false),
		multiplierGridUpdate: (emitterEvent) => {
			// step-up animation: each changed spot pops once per grid update (one update per tumble,
			// sent after that tumble's win highlights), however many clusters it was part of.
			const changed = new Set<string>();
			emitterEvent.grid.forEach((reel, r) =>
				reel.forEach((m, c) => {
					if (m > (grid[r]?.[c] ?? 0) && m > 1) changed.add(`${r}:${c}`);
				}),
			);
			grid = emitterEvent.grid;
			if (changed.size && props.layer === 'labels') {
				startPop(changed);
				// mock/e2e only: lets the harness verify one step-up per spot per tumble
				const g = globalThis as any;
				if (g.__VB_MOCK_RGS__) (g.__VB_POPS__ ??= []).push({ event: g.__VB_LAST_EVENT__, t: performance.now(), cells: [...changed] });
			}
		},
		multiplierGridClear: () => (grid = DEFAULT_GRID),
		multiplierGridHighlight: (e) => {
			if (props.layer !== 'frames') return;
			highlight = { reel: e.reel, row: e.row };
			setTimeout(() => (highlight = null), 1500);
		},
	});
</script>

<BoardContainer>
	{#if props.layer === 'frames' && highlight}
		<Rectangle
			x={highlight.reel * SYMBOL_SIZE}
			y={highlight.row * SYMBOL_SIZE}
			width={SYMBOL_SIZE}
			height={SYMBOL_SIZE}
			backgroundColor={0x00e5d4}
			backgroundAlpha={0.35}
			borderRadius={10}
		/>
	{/if}
	{#if show}
		{#each grid as reel, reelIndex}
			{#each reel as multiplier, rowIndex}
				{#if multiplier > 0}
					{@const tier = tierOf(multiplier)}
					<Container x={(reelIndex + 0.5) * SYMBOL_SIZE} y={(rowIndex + 0.5) * SYMBOL_SIZE}>
						{#if props.layer === 'frames'}
							{#if tier === 128 && multiplier > 1}
								<Sprite
									anchor={0.5}
									key="vb_mult_x128"
									width={SYMBOL_SIZE * (1.02 + 0.1 * glow)}
									height={SYMBOL_SIZE * (1.02 + 0.1 * glow)}
									alpha={0.15 + 0.55 * glow}
									blendMode="add"
								/>
							{/if}
							<!-- marked spot (x1) or tier frame below the symbols -->
							<Sprite
								anchor={0.5}
								key={multiplier > 1 ? `vb_mult_x${tier}` : 'vb_cell_frame'}
								width={SYMBOL_SIZE * 0.98}
								height={SYMBOL_SIZE * 0.98}
								alpha={multiplier > 1 ? 1 : 0.55}
							/>
						{:else if multiplier > 1}
							<!-- readable tier badge above the symbols -->
							<Container x={SYMBOL_SIZE * 0.24} y={SYMBOL_SIZE * 0.27} scale={popping.has(`${reelIndex}:${rowIndex}`) ? popScale : 1}>
								<Rectangle
									x={-SYMBOL_SIZE * 0.25}
									y={-SYMBOL_SIZE * 0.15}
									width={SYMBOL_SIZE * 0.5}
									height={SYMBOL_SIZE * 0.3}
									backgroundColor={0x07101f}
									backgroundAlpha={0.88}
									borderColor={TIER_COLORS[tier]}
									borderWidth={3}
									borderRadius={SYMBOL_SIZE * 0.12}
								/>
								<BitmapText
									anchor={0.5}
									text={`X${multiplier}`}
									style={{
										// untinted silver text; the tier color is carried by the badge border and the frame art
										fontFamily: 'silver', fill: 0xffffff,
										fontSize: SYMBOL_SIZE * (multiplier >= 100 ? 0.2 : 0.26),
									}}
								/>
							</Container>
						{/if}
					</Container>
				{/if}
			{/each}
		{/each}
	{/if}
</BoardContainer>
