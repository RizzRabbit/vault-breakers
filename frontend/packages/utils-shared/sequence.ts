export async function sequence<TItem, TResult>(
	itemList: TItem[],
	itemHandler: (item: TItem, index: number, arr: TItem[]) => Promise<TResult>,
) {
	const results: TResult[] = [];

	for (const [index, item] of itemList.entries()) {
		const result = await itemHandler(item, index, itemList);
		results.push(result);
	}

	return results;
}
