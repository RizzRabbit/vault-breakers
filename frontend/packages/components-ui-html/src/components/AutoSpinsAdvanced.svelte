<script lang="ts">
	import { slide } from 'svelte/transition';
	import { stateBetDerived } from 'state-shared';
	import { DropdownToggle } from 'components-shared';
	import { getContextEventEmitter } from 'utils-event-emitter';

	import AutoSpinsLossLimit from './AutoSpinsLossLimit.svelte';
	import AutoSpinsSingleWinLimit from './AutoSpinsSingleWinLimit.svelte';
	import type { EmitterEventModal } from '../types';
	import { i18nDerived } from '../i18n/i18nDerived';

	type Props = {
		ontoggle: (duration: number) => void;
	};

	const props: Props = $props();
	const { eventEmitter } = getContextEventEmitter<EmitterEventModal>();
	const SLIDE_DURATION = 100;

	let open = $state(false);

	$effect(() => {
		if (open) props.ontoggle(SLIDE_DURATION);
	});
</script>

<DropdownToggle
	{open}
	disabled={stateBetDerived.activeBetMode().type === 'activate'}
	onchange={(value) => {
		open = value;
		eventEmitter.broadcast({ type: 'soundPressGeneral' });
	}}
>
	<span>{i18nDerived.advanced()}</span>
</DropdownToggle>

{#if open}
	<div
		style="border: 2px solid white; border-radius: 10px;"
		transition:slide={{ duration: SLIDE_DURATION }}
	>
		<AutoSpinsLossLimit />
		<AutoSpinsSingleWinLimit />
	</div>
{/if}
