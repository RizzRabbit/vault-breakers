import _ from 'lodash';

export const createGetEmptyPaddedBoard = ({
	reelsDimensions,
}: {
	reelsDimensions: { x: number; y: number };
}) => {
	const getEmptyBoard = () =>
		_.range(reelsDimensions.x).map(() => _.range(reelsDimensions.y + 2).map(() => null));

	return { getEmptyBoard };
};
