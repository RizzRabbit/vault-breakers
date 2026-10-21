import { sequence } from 'utils-shared/sequence';

import type { BookEventHandlerMap, GetBookEventFromMap, GetBookEventContextFromMap } from './types';

export function createPlayBookUtils<TBookEventHandlerMap extends BookEventHandlerMap<any, any>>({
	bookEventHandlerMap,
	debug,
}: {
	bookEventHandlerMap: TBookEventHandlerMap;
	debug?: boolean;
}) {
	type TBookEvent = GetBookEventFromMap<TBookEventHandlerMap>;
	type BookEventContextFromMap = GetBookEventContextFromMap<TBookEventHandlerMap>;
	type BookEventContextFromMapWithoutBookEvents = Omit<BookEventContextFromMap, 'bookEvents'>;
	type BookEventContextOfBookEvents = { bookEvents: TBookEvent[] };
	type TBookEventContext = BookEventContextFromMapWithoutBookEvents & BookEventContextOfBookEvents;

	const playBookEvent = async (bookEvent: TBookEvent, bookEventContext: TBookEventContext) => {
		const bookEventHandler = bookEventHandlerMap?.[bookEvent.type];
		if (bookEventHandler) {
			if (debug) console.log(bookEvent);
			await bookEventHandler(bookEvent, bookEventContext);
		} else {
			console.error('Missing bookEventHandler in "bookEventHandlerMap" for: ', bookEvent);
		}
	};

	const playBookEvents = async (
		bookEvents: TBookEvent[],
		bookEventContext?: BookEventContextFromMapWithoutBookEvents,
	) => {
		const finalBookEventContext =
			bookEventContext || ({} as BookEventContextFromMapWithoutBookEvents);

		await sequence(bookEvents, async (bookEvent) => {
			await playBookEvent(bookEvent, { ...finalBookEventContext, bookEvents });
		});
	};

	return {
		playBookEvent,
		playBookEvents,
	};
}
