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
	import { BitmapText, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import config from '../game/config';

	const context = getContext();
	const PANEL_RATIO = 992 / 623;
	const panelSizes = { width: SYMBOL_SIZE * 2, height: (SYMBOL_SIZE * 2) / PANEL_RATIO };
	const position = $derived({
		x:
			context.stateGameDerived.boardLayout().x +
			context.stateGameDerived.boardLayout().width * 0.5 +
			SYMBOL_SIZE * 0.7,
		y:
			context.stateGameDerived.boardLayout().y -
			context.stateGameDerived.boardLayout().height * 0.5,
	});
	const fontSize = SYMBOL_SIZE * 0.24;

	let show = $state(false);
	let meter = $state(0);
	let next = $state<number | null>(config.vaultMeter.thresholds[0]);
	let flash = $state('');

	context.eventEmitter.subscribeOnMount({
		vaultMeterShow: () => (show = true),
		vaultMeterHide: () => (show = false),
		vaultMeterReset: () => {
			meter = 0;
			next = config.vaultMeter.thresholds[0];
			flash = '';
		},
		vaultMeterUpdate: (e) => {
			show = true;
			meter = e.meter;
			next = e.nextThreshold;
		},
		vaultMeterUpgrade: async (e) => {
			flash = `UPGRADE X${e.newMultiplier}`;
			await new Promise((r) => setTimeout(r, 900));
			flash = '';
		},
	});
</script>

<MainContainer>
	<FadeContainer {show} {...position}>
		<Sprite key="vb_vault_meter_frame" {...panelSizes} />
		<BitmapText
			x={panelSizes.width / 2}
			y={panelSizes.height * 0.28}
			anchor={{ x: 0.5, y: 0.5 }}
			text="VAULT METER"
			style={{ fontFamily: 'gold', fontSize }}
		/>
		<BitmapText
			x={panelSizes.width / 2}
			y={panelSizes.height * 0.6}
			anchor={{ x: 0.5, y: 0.5 }}
			text={flash || (next === null ? `${meter} MAX` : `${meter} OF ${next}`)}
			style={{ fontFamily: 'gold', fontSize }}
		/>
	</FadeContainer>
</MainContainer>
