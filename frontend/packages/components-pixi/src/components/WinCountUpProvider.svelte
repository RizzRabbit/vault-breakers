<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { type Snippet } from 'svelte';

	import { createInterruptible } from 'utils-shared/interruptible';

	type Props = {
		amount: number;
		duration: number;
		oncomplete: () => void;
		children: Snippet<
			[
				{
					countUpAmount: number;
					startCountUp: () => Promise<void>;
					finishCountUp: () => void;
					countUpCompleted: boolean;
				},
			]
		>;
	};

	const props: Props = $props();
	const countUpAmount = new Tween(0);
	const interruptible = createInterruptible();

	let countUpCompleted = $state(false);

	const countUp = () => countUpAmount.set(props.amount, { duration: props.duration });
	const resetCountUp = () => countUpAmount.set(props.amount, { duration: 0 });
	const finishCountUp = () => interruptible.interrupt();
	const startCountUp = async () => {
		await interruptible.add(countUp);
		resetCountUp();
		countUpCompleted = true;
		props.oncomplete();
		interruptible.clear();
	};
</script>

{@render props.children({
	countUpAmount: countUpAmount.current,
	startCountUp,
	finishCountUp,
	countUpCompleted,
})}
