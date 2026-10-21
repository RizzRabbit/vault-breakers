<script lang="ts" module>
	export type EmitterEventVaultFly = {
		type: 'vaultFly';
		reel: number;
		row: number;
		oldMultiplier: number;
		newMultiplier: number;
	};
</script>

<script lang="ts">
	import { BitmapText, Container, Sprite } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';
	import { waitForResolve } from 'utils-shared/wait';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';

	// Vault Meter -> spot fly-in. Starts at the meter panel, arcs to the 0-based grid cell
	// (vaultMeterUpgrade.position), then shows '+X2 VAULT' (new spot) or 'X{n} VAULT' (step-up).
	const context = getContext();
	const FLY_MS = 650;
	const LABEL_MS = 900;

	let active = $state(false);
	let p = $state(0);
	let label = $state('');
	let showLabel = $state(false);
	let mult = $state(2);
	let from = $state({ x: 0, y: 0 });
	let to = $state({ x: 0, y: 0 });

	const tier = (m: number) => [2, 4, 8, 16, 32, 64, 128].reduce((b, t) => (m >= t ? t : b), 2);

	context.eventEmitter.subscribeOnMount({
		vaultFly: async (e) => {
			const b = context.stateGameDerived.boardLayout();
			// meter panel centre (see VaultMeter.svelte position + panel size)
			const ph = (SYMBOL_SIZE * 2.4) / (992 / 623);
			from =
				context.stateLayoutDerived.layoutType() === 'portrait'
					? { x: b.x + SYMBOL_SIZE * 0.1 + SYMBOL_SIZE * 1.2, y: b.y - b.height * 0.5 - SYMBOL_SIZE * 0.75 - ph / 2 }
					: { x: b.x + b.width * 0.5 + SYMBOL_SIZE * 0.7 + SYMBOL_SIZE * 1.2, y: b.y - b.height * 0.5 + SYMBOL_SIZE * 0.75 };
			to = { x: b.x - b.width * 0.5 + (e.reel + 0.5) * SYMBOL_SIZE, y: b.y - b.height * 0.5 + (e.row + 0.5) * SYMBOL_SIZE };
			mult = e.newMultiplier;
			label = e.oldMultiplier <= 1 ? `+X${e.newMultiplier} VAULT` : `X${e.newMultiplier} VAULT`;
			p = 0;
			showLabel = false;
			active = true;
			await waitForResolve((resolve) => {
				const start = performance.now();
				const tick = (now: number) => {
					p = Math.min(1, (now - start) / FLY_MS);
					if (p < 1) requestAnimationFrame(tick);
					else resolve();
				};
				requestAnimationFrame(tick);
			});
			showLabel = true;
			await new Promise((r) => setTimeout(r, LABEL_MS));
			active = false;
			showLabel = false;
		},
	});

	const ease = $derived(1 - Math.pow(1 - p, 3));
	const pos = $derived({
		x: from.x + (to.x - from.x) * ease,
		y: from.y + (to.y - from.y) * ease - Math.sin(Math.PI * p) * SYMBOL_SIZE * 1.2,
	});
	const size = $derived(SYMBOL_SIZE * (0.6 + 0.4 * ease));
</script>

{#if active}
	<MainContainer>
		<Container {...pos} rotation={(1 - ease) * Math.PI}>
			<Sprite key={`vb_mult_x${tier(mult)}`} anchor={0.5} width={size} height={size} blendMode="add" />
			<Sprite key={`vb_mult_x${tier(mult)}`} anchor={0.5} width={size} height={size} />
		</Container>
		{#if showLabel}
			<BitmapText
				anchor={0.5}
				x={to.x}
				y={to.y - SYMBOL_SIZE * 0.62}
				text={label}
				style={{ fontFamily: 'silver', fontSize: SYMBOL_SIZE * 0.3 }}
			/>
		{/if}
	</MainContainer>
{/if}
