import { setup, createActor } from 'xstate';
// import { inspect } from '@xstate/inspect';

import type { IntermediateMachines } from './types';
import { context, type Context } from './machineContext';
import {
	STATE_RENDERING,
	STATE_IDLE,
	STATE_BET,
	STATE_AUTOBET,
	STATE_RESUME_BET,
} from './constants';

// states
const stateRendering = {
	on: {
		RENDERED: {
			target: 'idle',
		},
	},
};

const stateIdle = {
	on: {
		RESUME_BET: {
			target: 'resumeBet',
		},
		BET: {
			target: 'bet',
		},
		AUTO_BET: {
			target: 'autoBet',
		},
	},
};

const stateResumeBet = {
	invoke: {
		id: 'resumeBet',
		src: 'resumeBet' as const,
		onDone: 'idle',
	},
};

const stateBet = {
	invoke: {
		id: 'bet',
		src: 'bet' as const,
		onDone: 'idle',
	},
};

const stateAutoBet = {
	invoke: {
		id: 'autoBet',
		src: 'autoBet' as const,
		onDone: 'idle',
	},
};

const createGameActor = (intermediateMachines: IntermediateMachines) => {
	// machine
	const gameMachine = setup({
		types: {} as {
			context: Context;
		},
		actors: {
			bet: intermediateMachines.bet,
			autoBet: intermediateMachines.autoBet,
			resumeBet: intermediateMachines.resumeBet,
		},
	}).createMachine({
		context,
		initial: 'rendering',
		states: {
			[STATE_RENDERING]: stateRendering,
			[STATE_IDLE]: stateIdle, // Note: No intermediateMachines.idle exists
			[STATE_BET]: stateBet,
			[STATE_AUTOBET]: stateAutoBet,
			[STATE_RESUME_BET]: stateResumeBet,
		},
	});

	// create game actor
	const gameActor = createActor(gameMachine);

	return gameActor;
};

export { createGameActor };
