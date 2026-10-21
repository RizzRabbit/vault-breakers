import { getContextEventEmitter } from 'utils-event-emitter';
import { getContextXstate } from 'utils-xstate';
import { getContextLayout } from 'utils-layout';
import { getContextApp } from 'pixi-svelte';

import type { EmitterEventUi } from './types';

export const getContext = () => ({
	...getContextEventEmitter<EmitterEventUi>(),
	...getContextXstate(),
	...getContextLayout(),
	...getContextApp(),
});
