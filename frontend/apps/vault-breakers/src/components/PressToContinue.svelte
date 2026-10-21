<script lang="ts">
	import { MainContainer, OnPressFullScreen } from 'components-layout';
	import { OnHotkey } from 'components-shared';
	import { BitmapText } from 'pixi-svelte';
	import { onMount } from 'svelte';

	import { getContext } from '../game/context';

	type Props = {
		onpress: () => void;
	};

	const props: Props = $props();
	const context = getContext();
	let alpha = $state(1);
	onMount(() => {
		let raf = 0;
		const tick = (now: number) => {
			alpha = 0.6 + 0.4 * Math.sin(now / 300);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<MainContainer alignVertical="bottom">
	<BitmapText
		anchor={{ x: 0.5, y: 1 }}
		x={context.stateLayoutDerived.mainLayout().width * 0.5}
		y={context.stateLayoutDerived.mainLayout().height - 40}
		{alpha}
		text="TAP TO CONTINUE"
		style={{ fontFamily: 'gold', fill: 0xffffff, fontSize: 48 }}
	/>
</MainContainer>
<OnHotkey hotkey="Space" onpress={() => props.onpress()} />
<OnPressFullScreen onpress={() => props.onpress()} />
