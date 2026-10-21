export type BaseBookEvent = { index: number; type: string };
type BookEventUnionTypeToBookEventHandlerUnionType<
	TBookEvent,
	THandlerContext extends object,
> = TBookEvent extends any
	? (bookEvent: TBookEvent, context: THandlerContext) => Promise<void>
	: never;
export type BookEventHandler<
	TBookEvent extends BaseBookEvent,
	THandlerContext extends object,
> = BookEventUnionTypeToBookEventHandlerUnionType<TBookEvent, THandlerContext>;
export type BookEventHandlerMap<
	TBookEvent extends BaseBookEvent,
	THandlerContext extends object,
> = Record<string, BookEventHandler<TBookEvent, THandlerContext>>;
export type GetBookEventFromMap<T extends BookEventHandlerMap<any, any>> =
	T extends BookEventHandlerMap<infer U, any> ? U : never;
export type GetBookEventContextFromMap<T extends BookEventHandlerMap<any, any>> =
	T extends BookEventHandlerMap<any, infer U> ? U : never;
