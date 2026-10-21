<script lang="ts">
	import { Sprite } from 'pixi-svelte';

	import SymbolSprite from './SymbolSprite.svelte';
	import type { SymbolState, RawSymbol } from '../game/types';
	import { SYMBOL_SIZE } from '../game/constants';
	import { getSymbolInfo } from '../game/utils';

	type Props = {
		x?: number;
		y?: number;
		state: SymbolState;
		rawSymbol: RawSymbol;
		oncomplete?: () => void;
		loop?: boolean;
	};

	const props: Props = $props();
	const symbolInfo = $derived(getSymbolInfo({ rawSymbol: props.rawSymbol, state: props.state }));
	const showWinFrame = $derived(
		['win', 'postWinStatic', 'explosion'].includes(props.state) &&
			!['S'].includes(props.rawSymbol.name),
	);
</script>

<SymbolSprite {symbolInfo} state={props.state} x={props.x} y={props.y} oncomplete={props.oncomplete} />

{#if showWinFrame}
	<Sprite
		x={props.x}
		y={props.y}
		anchor={0.5}
		key="vb_cell_frame"
		width={SYMBOL_SIZE * 1.02}
		height={SYMBOL_SIZE * 1.02}
	/>
{/if}
