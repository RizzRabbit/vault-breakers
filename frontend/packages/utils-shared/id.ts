// https://developapa.com/object-ids/

let count: number = 1;

const idMap: WeakMap<Record<string, unknown> | Array<unknown>, number> = new WeakMap<
	Record<string, unknown> | Array<unknown>,
	number
>();

export function getObjectId(object: Record<string, unknown> | Array<unknown>): number {
	const objectId: number | undefined = idMap.get(object);
	if (objectId === undefined) {
		count += 1;
		idMap.set(object, count);

		return count;
	}

	return objectId;
}
