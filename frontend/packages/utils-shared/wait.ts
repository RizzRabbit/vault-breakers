type Resolve = (value: void | PromiseLike<void>) => void;

export const waitForResolve = (callback: (resolve: Resolve) => void) =>
	new Promise<void>((resolve) => callback(resolve));

export const waitForTimeout = (time: number) =>
	new Promise<void>((resolve) => {
		const timeout = setTimeout(() => {
			clearTimeout(timeout);
			resolve();
		}, time);
	});
