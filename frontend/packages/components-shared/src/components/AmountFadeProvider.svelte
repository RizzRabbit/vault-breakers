<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicIn as easingIn, cubicOut as easingOut } from 'svelte/easing';

	import { stateBetDerived } from 'state-shared';
	import { SECOND } from 'constants-shared/time';
	import { waitForTimeout } from 'utils-shared/wait';

	type Props = {
		amount: number;
		children: Snippet<[{ alpha: number }]>;
	};

	const props: Props = $props();
	const alpha = new Tween(0);
	const FADE_IN_DURATION = SECOND * 0.5;
	const BEFORE_FADE_OUT_DURATION = SECOND * 0.4;
	const FADE_OUT_DURATION = SECOND * 0.25;

	const getTimeScaler = () => {
		if (stateBetDerived.hasAutoBetCounter()) return 2;
		else return stateBetDerived.timeScale();
	};

	const fadeIn = async () => {
		alpha.set(0, { duration: 0 });
		await alpha.set(1, { duration: FADE_IN_DURATION / getTimeScaler(), easing: easingIn });
	};

	const fadeOut = async () => {
		await waitForTimeout(BEFORE_FADE_OUT_DURATION);
		await alpha.set(0, { duration: FADE_OUT_DURATION / getTimeScaler(), easing: easingOut });
	};

	$effect(() => {
		if (props.amount <= 0) {
			fadeOut();
		}
	});

	$effect(() => {
		if (props.amount > 0 && alpha.current === 0) {
			fadeIn();
		}
	});
</script>

<!-- {@render props.children({ alpha: alpha.current })} TODO -->
{@render props.children({ alpha: 1 })}
