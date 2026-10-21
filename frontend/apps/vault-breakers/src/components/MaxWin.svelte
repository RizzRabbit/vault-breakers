<script lang="ts" module>
	export type EmitterEventMaxWin = { type: 'maxWinShow'; amount: number };
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { backOut } from 'svelte/easing';

	import { BitmapText, Container, Sprite } from 'pixi-svelte';
	import { CanvasSizeRectangle, MainContainer } from 'components-layout';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve } from 'utils-shared/wait';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';

	import { getContext } from '../game/context';
	import config from '../game/config';
	import PressToContinue from './PressToContinue.svelte';

	// 'MAX WIN REACHED' screen: shown when a round ends on the win cap (base or cut-short free spins).
	const context = getContext();
	const AUTO_CLOSE_MS = 5000;
	let show = $state(false);
	let amount = $state(0);
	let close = $state(() => {});
	let timer: ReturnType<typeof setTimeout> | undefined;
	const pop = new Tween(0.3, { duration: 500, easing: backOut });

	context.eventEmitter.subscribeOnMount({
		maxWinShow: async (e) => {
			amount = e.amount;
			show = true;
			pop.set(0.3, { duration: 0 });
			pop.set(1);
			context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_youwon_panel' });
			await waitForResolve((resolve) => {
				let resolved = false;
				close = () => {
					if (resolved) return;
					resolved = true;
					clearTimeout(timer);
					resolve();
				};
				timer = setTimeout(() => close(), AUTO_CLOSE_MS);
			});
			show = false;
		},
	});
	onDestroy(() => clearTimeout(timer));

	const width = $derived(context.stateGameDerived.boardLayout().width * 1.35);
	const height = $derived((width / (1139 / 359)) * 1.9);
</script>

<FadeContainer {show}>
	<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.6} />
	<MainContainer>
		<Container
			x={context.stateGameDerived.boardLayout().x}
			y={context.stateGameDerived.boardLayout().y}
			scale={pop.current}
		>
			<Sprite key="vb_s" anchor={0.5} y={-height * 0.62} width={height * 0.55} height={height * 0.55} />
			<Sprite key="vb_plaque" anchor={0.5} {width} {height} />
			<BitmapText anchor={0.5} y={-height * 0.24} text="MAX WIN REACHED" style={{ fontFamily: 'gold', fontSize: height * 0.17 }} />
			<BitmapText anchor={0.5} y={height * 0.03} text={bookEventAmountToCurrencyString(amount)} style={{ fontFamily: 'silver', fontSize: height * 0.22 }} />
			<BitmapText anchor={0.5} y={height * 0.27} text={`${config.maxWin.toLocaleString('en-US')}X BET - VAULT EMPTIED`} style={{ fontFamily: 'gold', fontSize: height * 0.08 }} />
		</Container>
	</MainContainer>
	{#if show}
		<PressToContinue onpress={() => close()} />
	{/if}
</FadeContainer>
