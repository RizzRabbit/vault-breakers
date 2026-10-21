<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { untrack } from 'svelte';

	import { Container } from 'pixi-svelte';
	import { ResponsiveBitmapText } from 'components-pixi';
	import { bookEventAmountToCurrencyString } from 'utils-shared/amount';

	import { SYMBOL_SIZE } from '../game/constants';

	type Props = {
		width: number;
		amount: number;
		animate: boolean;
		oncomplete: () => void;
	};

	// Code-drawn tumble-win counter: count up; when animate is set, pop the value as well.
	const props: Props = $props();
	const amount = new Tween(0, { duration: 300 });
	const scale = new Tween(1, { duration: 140 });

	$effect(() => {
		const target = props.amount;
		const animate = props.animate;
		const done = props.oncomplete;
		untrack(async () => {
			if (animate) {
				await scale.set(1.3);
				await amount.set(target);
				await scale.set(1);
			} else {
				await amount.set(target);
			}
			done();
		});
	});
</script>

<Container scale={scale.current}>
	<ResponsiveBitmapText
		anchor={0.5}
		style={{ fontFamily: 'gold', fontSize: 0.5 * SYMBOL_SIZE }}
		text={bookEventAmountToCurrencyString(amount.current)}
		maxWidth={props.width * 0.85}
	/>
</Container>
