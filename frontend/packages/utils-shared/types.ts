export type FirstArgOf<T> = T extends (first: infer FirstArg, ...args: any[]) => any
	? FirstArg
	: never;
