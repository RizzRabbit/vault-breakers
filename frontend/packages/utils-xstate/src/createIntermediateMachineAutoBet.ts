import { setup, fromPromise } from 'xstate';
import { stateBet, stateBetDerived, stateModal } from 'state-shared';
import { bookEventAmountToNormalisedAmount } from 'utils-shared/amount';

import { context, type Context } from './machineContext';
import type { IntermediateMachineBet } from './types';

let oldbalanceAmount = 0;

const init = fromPromise(async () => {
	stateBet.winBookEventAmount = 0;
	stateBet.autoSpinsLoss = 0;
	oldbalanceAmount = stateBet.balanceAmount;
});

const checkInsufficientFunds = fromPromise(async () => {
	if (stateBetDerived.isBetCostAvailable()) return 'continue';

	stateBet.autoSpinsCounter = 0;
	stateModal.modal = { name: 'autoSpinMessage', message: 'insufficientFunds' };
	throw Error('End auto bet with insufficientFunds');
});

const checkLossLimit = fromPromise(async () => {
	if (stateBet.autoSpinsLossLimitAmount === Infinity) return 'continue';

	const newBalance = stateBet.balanceAmount;
	const loss = Math.round((oldbalanceAmount - newBalance) * 100) / 100;
	stateBet.autoSpinsLoss = loss;
	if (stateBet.autoSpinsLossLimitAmount > loss) return 'continue';

	stateBet.autoSpinsCounter = 0;
	stateModal.modal = { name: 'autoSpinMessage', message: 'lossLimitReached' };
	throw Error('End auto bet with lossLimitReached');
});

const checkIfSingleWinLimit = fromPromise(async () => {
	if (stateBet.autoSpinsSingleWinLimitAmount === Infinity) return 'continue';
	if (
		stateBet.autoSpinsSingleWinLimitAmount >
		bookEventAmountToNormalisedAmount(stateBet.winBookEventAmount)
	)
		return 'continue';
	stateBet.autoSpinsCounter = 0;
	stateModal.modal = { name: 'autoSpinMessage', message: 'singleWinLimitReached' };
	throw Error('End auto bet with singleWinLimitReached');
});

const checkAutoSpinsCounter = fromPromise(async () => {
	if (stateBet.autoSpinsCounter > 0) return 'continue';

	throw Error('End auto bet with autoSpinsCounter being 0');
});

const updateAutoSpinsCounter = fromPromise(async () => {
	const newValue = stateBet.autoSpinsCounter - 1;
	stateBet.autoSpinsCounter = newValue > 0 ? newValue : 0;
});

export const createIntermediateMachineAutoBet = ({ bet }: { bet: IntermediateMachineBet }) => {
	const machine =
		/** @xstate-layout N4IgpgJg5mDOIC5QCMwBcB0BLCAbMAxAEICiAKoqAA4D2sWaWNAdpSAB6ICMATAGwYADMMFcA7Dy4BWQQBZZgsQBoQAT24BmMRlkBOfQA4+fXWNl8pu2QF9rK1JgBm6AMYALLMygEILMNmYANxoAa38AWwBXNABDRhYidDZaenjWJA5EKQ0BWS0pHlMNGTE+FXUELlEMGRENXV4pKtFbe3QMZzR3T28wACc+mj6MKlw4xyHwjCjYtMS0ZLoGJnTQTgRs3PzCsWLFMrVEHjFBHX1TWXEzDQ0DGzsQBxGx1R8-AOCw55iK6iW0tjrKxcDAGRo8MEnRQ8crcHinc76QpSMxg3R8WwPZg0CBwNhPHD4RapFaAxCyGGHSoaEGI0oFPT1XStR7tTrdLzE5YsMkIeEGDC6O71LQGYSyMXKKlVXKIvhGc5cUwsp6jH5cgEZdYSXQYDQQrjmBrCKQHCq6U4iYQ0jQiMUaFXtMDMCAa0la7iKbSSAxiX2m4ToykVXgaQXnE5+iwNIyOhYZFLc1aZSoGWGpoRWrNWsSY6xAA */
		setup({
			types: {} as {
				context: Context;
			},
			actors: {
				init,
				checkInsufficientFunds,
				checkLossLimit,
				checkIfSingleWinLimit,
				checkAutoSpinsCounter,
				bet,
				updateAutoSpinsCounter,
			},
		}).createMachine({
			context,
			id: 'autoBet',
			initial: 'init',
			states: {
				init: {
					invoke: {
						id: 'init',
						src: 'init',
						onDone: 'checkInsufficientFunds',
						onError: 'end',
					},
				},
				checkInsufficientFunds: {
					invoke: {
						id: 'checkInsufficientFunds',
						src: 'checkInsufficientFunds',
						onDone: 'checkLossLimit',
						onError: 'end',
					},
				},
				checkLossLimit: {
					invoke: {
						id: 'checkLossLimit',
						src: 'checkLossLimit',
						onDone: 'checkIfSingleWinLimit',
						onError: 'end',
					},
				},
				checkIfSingleWinLimit: {
					invoke: {
						id: 'checkIfSingleWinLimit',
						src: 'checkIfSingleWinLimit',
						onDone: 'checkAutoSpinsCounter',
						onError: 'end',
					},
				},
				checkAutoSpinsCounter: {
					invoke: {
						id: 'checkAutoSpinsCounter',
						src: 'checkAutoSpinsCounter',
						onDone: 'playing',
						onError: 'end',
					},
				},
				playing: {
					invoke: {
						id: 'bet',
						src: 'bet',
						onDone: 'updateAutoSpinsCounter',
					},
				},
				updateAutoSpinsCounter: {
					invoke: {
						id: 'updateAutoSpinsCounter',
						src: 'updateAutoSpinsCounter',
						onDone: 'checkInsufficientFunds',
					},
				},
				end: {
					type: 'final',
				},
			},
		});

	return machine;
};
