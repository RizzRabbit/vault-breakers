import type { BaseBet } from './types';

export type Context = {
	bet: BaseBet | null;
	rawBet: BaseBet | null;
};

export const context = {
	bet: null,
	rawBet: null,
};
