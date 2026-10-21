import _, { type Dictionary } from 'lodash';

import { bookEventAmountToBetAmountMultiplier } from './amount';

type AmountMultiplierThreshold = number;
type BaseWinLevelData = {
	alias: string;
};

function createGetWinLevelDataByWinLevelAlias<
	TWinLevel extends number,
	TWinLevelData extends BaseWinLevelData,
>({ winLevelMap }: { winLevelMap: Record<TWinLevel, TWinLevelData> }) {
	type WinLevelAlias = (typeof winLevelMap)[TWinLevel]['alias'];

	const getWinLevelDataByWinLevelAlias = (winLevelAlias: WinLevelAlias) => {
		const winLevelData = _.values(winLevelMap as Record<string, TWinLevelData>).find(
			(data) => data.alias === winLevelAlias,
		);

		return winLevelData;
	};

	return { getWinLevelDataByWinLevelAlias };
}

function createGetWinLevelDataByBookEventAmount<
	TGameType extends string,
	TWinLevel extends number,
	TWinLevelData extends BaseWinLevelData,
>({
	gameType,
	winLevelMap,
	winLevelToBetAmountMultiplierThresholdMaps,
}: {
	gameType: TGameType;
	winLevelMap: Record<TWinLevel, TWinLevelData>;
	winLevelToBetAmountMultiplierThresholdMaps: Record<
		TGameType,
		Record<TWinLevel, AmountMultiplierThreshold>
	>;
}) {
	const getWinLevelDataByBookEventAmount = (bookEventAmount: number) => {
		type WinLevelThreshold = undefined | [TWinLevel, AmountMultiplierThreshold];

		const betAmountMultiplier = bookEventAmountToBetAmountMultiplier(bookEventAmount);
		const winLevelToBetAmountMultiplierThresholdMap = winLevelToBetAmountMultiplierThresholdMaps[
			gameType
		] as Dictionary<AmountMultiplierThreshold>;
		const winLevelToBetAmountMultiplierThreshold = _.entries(
			winLevelToBetAmountMultiplierThresholdMap,
		)
			.sort((a, b) => b[1] - a[1])
			.find(
				([_, betAmountMultiplierThreshold]) => betAmountMultiplier >= betAmountMultiplierThreshold,
			) as WinLevelThreshold;
		const winLevel = winLevelToBetAmountMultiplierThreshold?.[0];
		const winLevelData = winLevel ? winLevelMap[winLevel] : undefined;

		return winLevelData;
	};

	return { getWinLevelDataByBookEventAmount };
}

export { createGetWinLevelDataByWinLevelAlias, createGetWinLevelDataByBookEventAmount };
