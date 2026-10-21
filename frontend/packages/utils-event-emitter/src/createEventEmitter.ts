import { onMount } from 'svelte';

export type EmitterEventBase = {
	type: string;
};

export function createEventEmitter<TEmitterEvent extends EmitterEventBase>() {
	type EmitterEventType = TEmitterEvent['type'];
	type EmitterEventOfType<T> = Extract<TEmitterEvent, { type: T }>;
	type EmitterEventHandler = (emitterEvent: TEmitterEvent) => any;
	type EmitterEventHandlerOfType<T> = (emitterEvent: EmitterEventOfType<T>) => any;
	type EmitterEventHandlerMap = { [T in EmitterEventType]: EmitterEventHandlerOfType<T> };

	const subscriptions = new Set<EmitterEventHandler>();

	const subscribeHandler = (emitterEventHandler: EmitterEventHandler) => {
		subscriptions.add(emitterEventHandler);
		return () => subscriptions.delete(emitterEventHandler);
	};

	const subscribeHandlerMap = (emitterEventHandlerMap: Partial<EmitterEventHandlerMap>) => {
		return subscribeHandler((emitterEvent) => {
			const emitterEventHandler = emitterEventHandlerMap?.[emitterEvent.type as EmitterEventType];

			if (emitterEventHandler) {
				return emitterEventHandler(emitterEvent as EmitterEventOfType<EmitterEventType>);
			}
		});
	};

	const subscribeOnMount = (emitterEventHandlerMap: Partial<EmitterEventHandlerMap>) => {
		onMount(() => subscribeHandlerMap(emitterEventHandlerMap));
	};

	const broadcast = (emitterEvent: TEmitterEvent) => {
		subscriptions.forEach((emitterEventHandler) => {
			emitterEventHandler(emitterEvent);
		});
	};

	const broadcastAsync = (emitterEvent: TEmitterEvent) => {
		const getPromises = () =>
			Array.from(subscriptions).map((emitterEventHandler) => emitterEventHandler(emitterEvent));

		return Promise.all(getPromises());
	};

	const eventEmitter = {
		subscribeOnMount,
		broadcast,
		broadcastAsync,
	};

	return { eventEmitter };
}
