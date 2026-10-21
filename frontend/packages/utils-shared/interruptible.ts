export const createInterruptible = () => {
	type ResolveArgs = { interrupted: boolean };
	type Resolve = (args: ResolveArgs) => void;

	let resolveList: Resolve[] = [];

	const add = (targetToWait: () => Promise<any>) =>
		new Promise<ResolveArgs>(async (resolve) => {
			resolveList.push(resolve);
			await targetToWait();
			resolve({ interrupted: false });
		});

	const clear = () => (resolveList = []);
	const getLength = () => resolveList.length;
	const interrupt = () => resolveList.forEach((resolve) => resolve({ interrupted: true }));

	return {
		add,
		clear,
		getLength,
		interrupt,
	};
};
