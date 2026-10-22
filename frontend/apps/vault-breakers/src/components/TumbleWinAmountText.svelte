<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { backOut, cubicOut } from 'svelte/easing';
	import { untrack } from 'svelte';

	import { Container } from 'pixi-svelte';
	import { ResponsiveBitmapText } from 'components-pixi';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';

	import { SYMBOL_SIZE } from '../game/constants';
	import { CONSOLE_PANEL } from '../game/consoleLayout';

	type Props = {
		width: number;
		amount: number;
		animate: boolean;
		oncomplete: () => void;
	};

	// Code-drawn tumble-win counter: count up; when animate is set, pop the value as well.
	const props: Props = $props();
	const amount = new Tween(0, { duration: 300, easing: cubicOut });
	const scale = new Tween(1, { duration: 140 });

	$effect(() => {
		const target = props.amount;
		const animate = props.animate;
		const done = props.oncomplete;
		untrack(async () => {
			if (animate) {
				await scale.set(1.3, { easing: backOut });
				await amount.set(target);
				await scale.set(1, { easing: cubicOut });
			} else {
				await amount.set(target);
			}
			done();
		});
	});
</script>

<Container y={CONSOLE_PANEL.height * 0.08} scale={scale.current}>
	<ResponsiveBitmapText
		anchor={0.5}
		style={{ fontFamily: 'gold', fill: 0xffffff, fontSize: 0.42 * SYMBOL_SIZE }}
		text={bookEventAmountToCurrencyString(amount.current)}
		maxWidth={props.width * 0.85}
	/>
</Container>
