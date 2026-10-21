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

	// Optical centering. Ink bounds measured from the glyph alpha in vb_{gold,silver}.png
	// (font units; Pixi lays out the line box at lineHeight with the glyph cell from its top):
	// silver: lineHeight 97, digit/cap ink 28..149 (cells are 166 tall: glow + descender padding)
	// gold:   lineHeight 105, cap ink 18..93
	const INK = { silver: { lh: 97, top: 28, bottom: 149 }, gold: { lh: 105, top: 18, bottom: 93 } } as const;
	type InkFont = keyof typeof INK;
	// ink top/bottom (in plaque units) of an anchor-0.5 line centered at y
	const inkOf = (font: InkFont, fontSize: number, y: number) => {
		const m = INK[font];
		const boxTop = y - fontSize / 2;
		return { top: boxTop + (m.top / m.lh) * fontSize, bottom: boxTop + (m.bottom / m.lh) * fontSize };
	};
	// y for an anchor-0.5 line so its ink is centered on `center`
	const yForInkCenter = (font: InkFont, fontSize: number, center: number) => {
		const m = INK[font];
		return center + fontSize / 2 - (((m.top + m.bottom) / 2) / m.lh) * fontSize;
	};
	// silver advance widths (font units / lineHeight) so long retrigger titles fit the plaque
	const SILVER_ADV: Record<string, number> = {"+": 0.742, "0": 0.876, "1": 0.66, "2": 0.825, "3": 0.825, "4": 0.845, "5": 0.825, "6": 0.856, "7": 0.732, "8": 0.835, "9": 0.856, "A": 0.876, "B": 0.928, "C": 0.897, "D": 0.928, "E": 0.742, "F": 0.722, "G": 0.918, "H": 0.959, "I": 0.546, "J": 0.608, "K": 0.897, "L": 0.732, "M": 1.082, "N": 0.887, "O": 0.928, "P": 0.907, "Q": 0.928, "R": 0.938, "S": 0.825, "T": 0.732, "U": 0.928, "V": 0.845, "W": 1.072, "X": 0.825, "Y": 0.804, "Z": 0.722};
	const silverWidth = (text: string) => [...text].reduce((w, c) => w + (SILVER_ADV[c] ?? 0.6), 0);
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
			{@const topSize = sizes.height * (extraSpins === undefined && tier !== 'regular' ? 0.15 : 0.2)}
			{@const midText = extraSpins !== undefined ? TITLE[tier] : `${freeSpinsFromEvent}`}
			{@const midSize = Math.min(sizes.height * (extraSpins !== undefined ? 0.22 : 0.3), (sizes.width * 0.74) / silverWidth(midText))}
			{@const bottomSize = sizes.height * 0.1}
			{@const topY = -sizes.height * 0.24}
			{@const bottomY = sizes.height * 0.3}
			{@const gapCenter = (inkOf('gold', topSize, topY).bottom + inkOf('gold', bottomSize, bottomY).top) / 2}
			<BitmapText
				anchor={0.5}
				y={topY}
				text={extraSpins !== undefined ? `${extraSpins} MORE` : TITLE[tier]}
				style={{ fontFamily: 'gold', fill: COLOR[tier], fontSize: topSize }}
			/>
			<BitmapText
				anchor={0.5}
				y={yForInkCenter('silver', midSize, gapCenter)}
				text={midText}
				style={{ fontFamily: 'silver', fill: 0xffffff, fontSize: midSize }}
			/>
			<BitmapText
				anchor={0.5}
				y={bottomY}
				text={startMultiplier > 1 && extraSpins === undefined
					? `EVERY SPOT STARTS AT X${startMultiplier}`
					: tier === 'epic' ? 'THE GRAND VAULT IS OPEN' : 'THE VAULT IS OPEN'}
				style={{ fontFamily: 'gold', fill: 0xffffff, fontSize: bottomSize }}
			/>
		{/snippet}
	</FreeSpinAnimation>

	<PressToContinue onpress={() => oncomplete()} />
</FadeContainer>
