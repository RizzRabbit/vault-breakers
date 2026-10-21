<script lang="ts">
	import type { Snippet } from 'svelte';

	import { BitmapText, Sprite, type Sizes } from 'pixi-svelte';

	import { CONSOLE_PANEL } from '../game/consoleLayout';

	type Props = {
		children: Snippet<[{ frameSizes: Sizes }]>;
	};

	// loot panel: same console frame as the free-spin counter and the Vault Meter
	const props: Props = $props();
	const fontSize = CONSOLE_PANEL.height * 0.14;
</script>

<Sprite anchor={0.5} key="vb_vault_meter_frame" {...CONSOLE_PANEL} />
<BitmapText
	anchor={0.5}
	y={-CONSOLE_PANEL.height * 0.23}
	text="LOOT"
	style={{ fontFamily: 'gold', fill: 0xffffff, fontSize }}
/>
{@render props.children({ frameSizes: { width: CONSOLE_PANEL.width * 0.8, height: CONSOLE_PANEL.height } })}
