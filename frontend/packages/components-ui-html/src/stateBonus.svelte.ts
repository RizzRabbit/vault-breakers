import { stateMeta } from 'state-shared';

export const stateBonus = $state({
	selectedBetModeKey: 'base',
});

export const stateBonusDerived = {
	selectedBetModeData: () => stateMeta.betModeMeta[stateBonus.selectedBetModeKey],
};
