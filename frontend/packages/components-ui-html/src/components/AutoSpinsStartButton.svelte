<script lang="ts">
	import { Button } from 'components-shared';
	import {
		stateUi,
		stateBet,
		stateModal,
		stateBetDerived,
		AUTO_SPINS_TEXT_OPTION_MAP,
		AUTO_SPINS_LOSS_LIMIT_MULTIPLIER_MAP,
		AUTO_SPINS_SINGLE_WIN_LIMIT_MULTIPLIER_MAP,
	} from 'state-shared';
	import { getContextEventEmitter } from 'utils-event-emitter';

	import BaseIcon from './BaseIcon.svelte';
	import BaseButtonContent from './BaseButtonContent.svelte';
	import { i18nDerived } from '../i18n/i18nDerived';
	import type { EmitterEventModal } from '../types';

	const { eventEmitter } = getContextEventEmitter<EmitterEventModal>();

	const startAutoBet = () => {
		stateBet.autoSpinsCounter = AUTO_SPINS_TEXT_OPTION_MAP[stateUi.autoSpinsText];
		stateBet.autoSpinsLossLimitAmount = stateBet.betAmount * AUTO_SPINS_LOSS_LIMIT_MULTIPLIER_MAP[stateUi.autoSpinsLossLimitText]; // prettier-ignore
		stateBet.autoSpinsSingleWinLimitAmount = stateBet.betAmount * AUTO_SPINS_SINGLE_WIN_LIMIT_MULTIPLIER_MAP[stateUi.autoSpinsSingleWinLimitText]; // prettier-ignore
		if (stateBetDerived.activeBetMode().type === 'buy') stateBet.activeBetModeKey = 'BASE';
		eventEmitter.broadcast({ type: 'soundPressGeneral' });
		eventEmitter.broadcast({ type: 'autoBet' });
		stateModal.modal = null;
	};
</script>

<Button disabled={!stateBetDerived.isBetCostAvailable()} onclick={startAutoBet}>
	<BaseIcon width="100%" height="3rem" />
	<BaseButtonContent>
		<span style="font-size: 1rem;">{i18nDerived.startAutoplay()}</span>
	</BaseButtonContent>
</Button>
