<script lang="ts" module>
	import type { WinLevelData } from '../game/winLevelMap';

	export type EmitterEventFreeSpinOutro =
		| { type: 'freeSpinOutroShow' }
		| { type: 'freeSpinOutroHide' }
		| { type: 'freeSpinOutroCountUp'; amount: number; winLevelData: WinLevelData; tier?: 'regular' | 'super' | 'epic' };
</script>

<script lang="ts">
	import { BitmapText } from 'pixi-svelte';
	import { FadeContainer, WinCountUpProvider, ResponsiveBitmapText } from 'components-pixi';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';
	import { waitForResolve } from 'utils-shared/wait';
	import { CanvasSizeRectangle } from 'components-layout';
	import { OnMount } from 'components-shared';

	import { getContext } from '../game/context';
	import FreeSpinAnimation from './FreeSpinAnimation.svelte';
	import PressToContinue from './PressToContinue.svelte';
	import WinCoins from './WinCoins.svelte';

	const context = getContext();

	let show = $state(true);
	let amount = $state(0);
	let winLevelData = $state<WinLevelData>();
	let tier = $state<'regular' | 'super' | 'epic'>('regular');
	const DONE = { regular: 'FREE SPINS COMPLETE', super: 'SUPER FREE SPINS COMPLETE', epic: 'EPIC FREE SPINS COMPLETE' } as const;
	const COLOR = { regular: 0xffffff, super: 0x9ff7ff, epic: 0xff5a4a } as const;
	let oncomplete = $state(() => {});
	let onCountUpComplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinOutroShow: () => (show = true),
		freeSpinOutroHide: async () => (show = false),
		freeSpinOutroCountUp: async (emitterEvent) => {
			amount = emitterEvent.amount;
			winLevelData = emitterEvent.winLevelData;
			tier = emitterEvent.tier ?? 'regular';
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show}>
	{#if winLevelData}
		{@const duration = winLevelData.presentDuration}
		{@const isBigWin = winLevelData.type === 'big'}
		<WinCountUpProvider {amount} {duration} oncomplete={() => onCountUpComplete()}>
			{#snippet children({ countUpAmount, startCountUp, finishCountUp, countUpCompleted })}
				<OnMount onmount={() => startCountUp()} />

				<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

				<FreeSpinAnimation {tier}>
					{#snippet children({ sizes })}
						<BitmapText
							anchor={0.5}
							y={-sizes.height * 0.24}
							text={tier === 'epic' ? 'EPIC HEIST TOTAL' : tier === 'super' ? 'SUPER HEIST TOTAL' : isBigWin ? 'VAULT CRACKED' : 'HEIST TOTAL'}
							style={{ fontFamily: 'gold', fill: COLOR[tier], fontSize: sizes.height * (tier === 'regular' ? 0.17 : 0.13) }}
						/>
						<ResponsiveBitmapText
							anchor={0.5}
							y={sizes.height * 0.05}
							style={{ fontFamily: 'silver', fill: 0xffffff, fontSize: sizes.height * 0.26 }}
							text={bookEventAmountToCurrencyString(countUpAmount)}
							maxWidth={sizes.width * 0.8}
						/>
						<BitmapText
							anchor={0.5}
							y={sizes.height * 0.29}
							text={DONE[tier]}
							style={{ fontFamily: 'gold', fill: 0xffffff, fontSize: sizes.height * 0.09 }}
						/>
					{/snippet}
				</FreeSpinAnimation>

				<WinCoins emit={!countUpCompleted} levelAlias={winLevelData?.alias} />

				<PressToContinue onpress={() => (countUpCompleted ? oncomplete() : finishCountUp())} />
			{/snippet}
		</WinCountUpProvider>
	{/if}
</FadeContainer>
