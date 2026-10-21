<script lang="ts" module>
	// vaultMeterUpdate / vaultMeterUpgrade per math/EVENTS.md (math 6ec4aaf).
	export type EmitterEventVaultMeter =
		| { type: 'vaultMeterShow' }
		| { type: 'vaultMeterHide' }
		| { type: 'vaultMeterReset' }
		| { type: 'vaultMeterUpdate'; meter: number; nextThreshold: number | null }
		| { type: 'vaultMeterUpgrade'; meter: number; oldMultiplier: number; newMultiplier: number };
</script>

<script lang="ts">
	import { MainContainer } from 'components-layout';
	import { FadeContainer } from 'components-pixi';
	import { BitmapText, Rectangle, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import config from '../game/config';
	import { CONSOLE_PANEL, consoleSlot } from '../game/consoleLayout';

	const context = getContext();
	const panelSizes = CONSOLE_PANEL;
	// heist console slot 2 (see game/consoleLayout.ts)
	const slot = $derived(consoleSlot(2));
	const position = $derived({ x: slot.x, y: slot.y });

	const fontSize = SYMBOL_SIZE * 0.2;
	const tickFont = SYMBOL_SIZE * 0.13;
	const MAX_METER = config.vaultMeter.thresholds[config.vaultMeter.thresholds.length - 1];
	const track = {
		x: panelSizes.width * 0.16,
		y: panelSizes.height * 0.6,
		width: panelSizes.width * 0.68,
		height: panelSizes.height * 0.08,
	};

	let show = $state(false);
	let meter = $state(0);
	let next = $state<number | null>(config.vaultMeter.thresholds[0]);
	let flash = $state('');
	// all 25 spots at the x128 cap -> meter shows MAX
	let gridMaxed = $state(false);

	context.eventEmitter.subscribeOnMount({
		vaultMeterShow: () => (show = true),
		vaultMeterHide: () => (show = false),
		vaultMeterReset: () => {
			meter = 0;
			gridMaxed = false;
			next = config.vaultMeter.thresholds[0];
			flash = '';
		},
		vaultMeterUpdate: (e) => {
			show = true;
			meter = e.meter;
			next = e.nextThreshold;
		},
		multiplierGridUpdate: (e) => {
			gridMaxed = e.grid.flat().length > 0 && e.grid.flat().every((m) => m >= config.maxSpotMultiplier);
		},
		multiplierGridClear: () => (gridMaxed = false),
		vaultMeterUpgrade: async (e) => {
			flash = `UPGRADE X${e.newMultiplier}`;
			await new Promise((r) => setTimeout(r, 900));
			flash = '';
		},
	});
</script>

<MainContainer>
	<FadeContainer {show} {...position} scale={slot.scale}>
		<Sprite key="vb_vault_meter_frame" {...panelSizes} />
		<BitmapText
			x={panelSizes.width / 2}
			y={panelSizes.height * 0.27}
			anchor={{ x: 0.5, y: 0.5 }}
			text="VAULT METER"
			style={{ fontFamily: 'gold', fill: 0xffffff, fontSize }}
		/>
		<BitmapText
			x={panelSizes.width / 2}
			y={panelSizes.height * 0.47}
			anchor={{ x: 0.5, y: 0.5 }}
			text={flash || (gridMaxed ? 'MAX' : next === null ? `${meter} MAX` : `${meter} OF ${next}`)}
			style={{ fontFamily: flash ? 'silver' : 'gold', fill: 0xffffff, fontSize }}
		/>
		<!-- progress track with 10 / 20 / 30 tick marks -->
		<Rectangle
			x={track.x}
			y={track.y}
			width={track.width}
			height={track.height}
			backgroundColor={0x07101f}
			borderColor={0xd6a028}
			borderWidth={2}
			borderRadius={track.height / 2}
		/>
		{#if meter > 0}
			<Rectangle
				x={track.x + 2}
				y={track.y + 2}
				width={Math.max(track.height - 4, (track.width - 4) * Math.min(1, meter / MAX_METER))}
				height={track.height - 4}
				backgroundColor={0x00e5d4}
				borderRadius={(track.height - 4) / 2}
			/>
		{/if}
		{#each config.vaultMeter.thresholds as t}
			{@const tx = track.x + (track.width * t) / MAX_METER}
			<Rectangle
				x={tx - (t === MAX_METER ? 3 : 1.5)}
				y={track.y - 4}
				width={3}
				height={track.height + 8}
				backgroundColor={meter >= t ? 0xffd75a : 0x8a6a20}
			/>
			<BitmapText
				x={t === MAX_METER ? tx - 4 : tx}
				y={track.y + track.height + tickFont * 0.7}
				anchor={{ x: t === MAX_METER ? 1 : 0.5, y: 0.5 }}
				text={`${t}`}
				style={{ fontFamily: meter >= t ? 'gold' : 'silver', fill: 0xffffff, fontSize: tickFont }}
			/>
		{/each}
	</FadeContainer>
</MainContainer>
