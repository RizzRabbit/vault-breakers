import type { BetType } from 'rgs-requests';

import type { createPrimaryMachines } from './createPrimaryMachines';
import type { createIntermediateMachineBet } from './createIntermediateMachineBet';
import type { createIntermediateMachineAutoBet } from './createIntermediateMachineAutoBet';
import type { createIntermediateMachineResumeBet } from './createIntermediateMachineResumeBet';

export type IntermediateMachineBet = ReturnType<typeof createIntermediateMachineBet>;
export type IntermediateMachineAutoBet = ReturnType<typeof createIntermediateMachineAutoBet>;
export type IntermediateMachineResumeBet = ReturnType<typeof createIntermediateMachineResumeBet>;

export type IntermediateMachines = {
	bet: IntermediateMachineBet;
	autoBet: IntermediateMachineAutoBet;
	resumeBet: IntermediateMachineResumeBet;
};

export type PrimaryMachines = ReturnType<typeof createPrimaryMachines>;

export type BaseBet = BetType<any>;
