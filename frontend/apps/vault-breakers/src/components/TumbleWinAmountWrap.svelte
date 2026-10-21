<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Container } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';

	import { CONSOLE_PANEL, consoleSlot } from '../game/consoleLayout';

	type Props = {
		show: boolean;
		children: Snippet;
	};

	// loot (tumble win) panel: heist console slot 1 (see game/consoleLayout.ts); children draw centred
	const props: Props = $props();
	const slot = $derived(consoleSlot(1));
</script>

<FadeContainer show={props.show}>
	<Container
		x={slot.x + (CONSOLE_PANEL.width * slot.scale) / 2}
		y={slot.y + (CONSOLE_PANEL.height * slot.scale) / 2}
		scale={slot.scale}
	>
		{@render props.children()}
	</Container>
</FadeContainer>
