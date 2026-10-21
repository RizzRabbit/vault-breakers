<script lang="ts" module>
	export type EmitterEventFreeSpinIntro =
		| { type: 'freeSpinIntroShow' }
		| { type: 'freeSpinIntroHide' }
		| {
				type: 'freeSpinIntroUpdate';
				totalFreeSpins: number;
				extraSpins?: number;
				tier?: 'regular' | 'super' | 'epic';
				startMultiplier?: number;
		  };
</script>

<script lang="ts">
	import { CanvasSizeRectangle } from 'components-layout';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve } from 'utils-shared/wait';
	import { BitmapText } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import PressToContinue from './PressToContinue.svelte';
	import FreeSpinAnimation from './FreeSpinAnimation.svelte';

	const context = getContext();

	let show = $state(false);
	let freeSpinsFromEvent = $state(0);
	// retrigger: number of spins ADDED (not the new total)
	let extraSpins = $state<number | undefined>(undefined);
	let tier = $state<'regular' | 'super' | 'epic'>('regular');
	let startMultiplier = $state(0);
	const TITLE = { regular: 'FREE SPINS', super: 'SUPER FREE SPINS', epic: 'EPIC FREE SPINS' } as const;
	const COLOR = { regular: 0xffffff, super: 0x9ff7ff, epic: 0xff5a4a } as const;
	let oncomplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinIntroShow: () => (show = true),
		freeSpinIntroHide: () => (show = false),
		freeSpinIntroUpdate: async (emitterEvent) => {
			// if (emitterEvent.extraSpins) {
			// 	context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_fs_respins' });
			// }
			// freeSpinsFromEvent = emitterEvent.extraSpins ?? emitterEvent.totalFreeSpins;
			freeSpinsFromEvent = emitterEvent.totalFreeSpins;
			extraSpins = emitterEvent.extraSpins;
			tier = emitterEvent.tier ?? 'regular';
			startMultiplier = emitterEvent.startMultiplier ?? 0;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show}>
	<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

	<FreeSpinAnimation {tier}>
		{#snippet children({ sizes })}
			<BitmapText
				anchor={0.5}
				y={-sizes.height * 0.24}
				text={extraSpins !== undefined ? `${extraSpins} MORE` : TITLE[tier]}
				style={{ fontFamily: 'gold', fill: COLOR[tier], fontSize: sizes.height * (extraSpins === undefined && tier !== 'regular' ? 0.15 : 0.2) }}
			/>
			<BitmapText
				anchor={0.5}
				y={sizes.height * 0.04}
				text={extraSpins !== undefined ? TITLE[tier] : `${freeSpinsFromEvent}`}
				style={{ fontFamily: 'silver', fill: 0xffffff, fontSize: sizes.height * (extraSpins !== undefined ? 0.22 : 0.3) }}
			/>
			<BitmapText
				anchor={0.5}
				y={sizes.height * 0.3}
				text={startMultiplier > 1 && extraSpins === undefined
					? `EVERY SPOT STARTS AT X${startMultiplier}`
					: tier === 'epic' ? 'THE GRAND VAULT IS OPEN' : 'THE VAULT IS OPEN'}
				style={{ fontFamily: 'gold', fill: 0xffffff, fontSize: sizes.height * 0.1 }}
			/>
		{/snippet}
	</FreeSpinAnimation>

	<PressToContinue onpress={() => oncomplete()} />
</FadeContainer>
