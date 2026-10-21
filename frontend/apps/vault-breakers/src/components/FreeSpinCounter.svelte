<script lang="ts" module>
	export type EmitterEventFreeSpinCounter =
		| { type: 'freeSpinCounterShow' }
		| { type: 'freeSpinCounterHide' }
		| { type: 'freeSpinCounterUpdate'; current?: number; total?: number };
</script>

<script lang="ts">
	import { MainContainer } from 'components-layout';
	import { FadeContainer } from 'components-pixi';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import { CONSOLE_PANEL, consoleSlot } from '../game/consoleLayout';
	// current free-spin tier shown in the console counter
	const TIER_FILL = { regular: 0xffffff, super: 0x9ff7ff, epic: 0xff5a4a } as const;
	import { anchorToPivot, BitmapText, Container, Sprite, type Sizes } from 'pixi-svelte';

	const context = getContext();
	const PANEL_KEY_DESKTOP = 'vb_vault_meter_frame';
	const PANEL_RATIO_DESKTOP = 992 / 623;
	const panelKey = PANEL_KEY_DESKTOP;
	const panelWidth = CONSOLE_PANEL.width;
	const panelSizes = $derived({
		width: panelWidth,
		height: panelWidth / PANEL_RATIO_DESKTOP,
	});
		// heist console slot 0 (see game/consoleLayout.ts)
	const slot = $derived(consoleSlot(0));
	const position = $derived({ x: slot.x, y: slot.y });
	const scale = $derived(slot.scale);

	const fontSize = SYMBOL_SIZE * 0.275;

	let show = $state(false);
	let current = $state(0);
	let total = $state(0);
	let titleSizes: Sizes = $state({ width: 0, height: 0 });
	let counterSizes: Sizes = $state({ width: 0, height: 0 });

	const textContainerSizes = $derived({
		width: titleSizes.width,
		height: titleSizes.height + counterSizes.height,
	});
	const counterPosition = $derived({ x: titleSizes.width / 2, y: titleSizes.height });

	context.eventEmitter.subscribeOnMount({
		freeSpinCounterShow: () => (show = true),
		freeSpinCounterHide: () => (show = false),
		freeSpinCounterUpdate: (emitterEvent) => {
			if (emitterEvent.current !== undefined) current = emitterEvent.current;
			if (emitterEvent.total !== undefined) total = emitterEvent.total;
		},
	});
</script>

<MainContainer>
	<FadeContainer {show} {...position} {scale}>
		<Sprite key={panelKey} {...panelSizes} />
		<Container
			x={panelSizes.width * 0.5}
			y={panelSizes.height * 0.48}
			pivot={anchorToPivot({
				sizes: textContainerSizes,
				anchor: { x: 0.5, y: 0.5 },
			})}
		>
			<BitmapText
				text={`${context.stateGame.fsTier.toUpperCase()} SPINS`}
				style={{
					fontFamily: 'gold', fill: TIER_FILL[context.stateGame.fsTier],
					fontSize,
					wordWrap: false,
				}}
				onresize={(sizes) => (titleSizes = sizes)}
			/>
			<BitmapText
				text={`${current} OF ${total}`}
				{...counterPosition}
				anchor={{ x: 0.5, y: 0 }}
				style={{
					fontFamily: 'gold', fill: 0xffffff,
					fontSize,
				}}
				onresize={(sizes) => (counterSizes = sizes)}
			/>
		</Container>
	</FadeContainer>
</MainContainer>
