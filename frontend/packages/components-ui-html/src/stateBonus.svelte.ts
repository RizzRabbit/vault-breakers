import { stateMeta } from 'state-shared';

export const stateBonus = $state({
	selectedBetModeKey: 'BASE',
});

export const stateBonusDerived = {
	selectedBetModeData: () => stateMeta.betModeMeta[stateBonus.selectedBetModeKey],
};
