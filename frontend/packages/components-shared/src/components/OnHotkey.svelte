<script lang="ts">
	import { onDestroy } from 'svelte';

	import { getContextEventEmitter } from 'utils-event-emitter';
	import { createInterruptible } from 'utils-shared/interruptible';
	import { waitForTimeout } from 'utils-shared/wait';

	import type { EmitterEventHotKey } from '../types';

	type Props = {
		hotkey: string;
		disabled?: boolean;
		onpress?: () => void;
		onpressend?: () => void;
		onhold?: () => void;
		onholdend?: () => void;
	};

	const props: Props = $props();
	const context = getContextEventEmitter<EmitterEventHotKey>();
	const interruptible = createInterruptible();
	const WAIT_TO_HOLD_TIMEOUT = 400;
	let isHolding = $state(false);
	let isWaitingToHold = $state(false);

	const holdTimeoutStart = async () => {
		isWaitingToHold = true;
		const { interrupted } = await interruptible.add(() => waitForTimeout(WAIT_TO_HOLD_TIMEOUT));
		if (!interrupted) {
			isHolding = true;
			props.onhold?.();
		}
	};

	const holdTimeoutStop = () => {
		isWaitingToHold = false;
		interruptible.interrupt();
		interruptible.clear();
	};

	const keyDown = () => {
		if (!isWaitingToHold) holdTimeoutStart();
		if (!isHolding) props.onpress?.();
	};

	const keyUp = () => {
		if (isWaitingToHold) holdTimeoutStop();

		if (isHolding) {
			props.onholdend?.();
		} else {
			props.onpressend?.();
		}

		isHolding = false;
	};

	context.eventEmitter.subscribeOnMount({
		hotKey: (emitterEvent) => {
			if (props.disabled) return;
			if (emitterEvent.key !== props.hotkey) return;
			if (emitterEvent.action === 'keyUp') return keyUp();
			if (emitterEvent.action === 'keyDown') return keyDown();
		},
	});

	$effect(() => {
		if (props.disabled) keyUp();
	});

	onDestroy(() => keyUp());

	$effect(() => {
		if (isHolding) props.onhold?.();
	});
</script>
