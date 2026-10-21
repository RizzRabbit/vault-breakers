export default {
	reveal: {
		type: 'reveal',
		board: [
			[
				{
					name: 'L1',
				},
				{
					name: 'H1',
				},
				{
					name: 'L1',
				},
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'L3',
				},
				{
					name: 'L2',
				},
				{
					name: 'L3',
				},
				{
					name: 'H3',
				},
			],
			[
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'L3',
				},
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'L3',
				},
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'H2',
				},
			],
			[
				{
					name: 'L3',
				},
				{
					name: 'H3',
				},
				{
					name: 'L1',
				},
				{
					name: 'L1',
				},
				{
					name: 'H4',
				},
				{
					name: 'L2',
				},
				{
					name: 'H4',
				},
				{
					name: 'H4',
				},
				{
					name: 'H2',
				},
			],
			[
				{
					name: 'H4',
				},
				{
					name: 'L1',
				},
				{
					name: 'H2',
				},
				{
					name: 'H2',
				},
				{
					name: 'H4',
				},
				{
					name: 'H2',
				},
				{
					name: 'H2',
				},
				{
					name: 'L3',
				},
				{
					name: 'L3',
				},
			],
			[
				{
					name: 'L1',
				},
				{
					name: 'L1',
				},
				{
					name: 'H3',
				},
				{
					name: 'H1',
				},
				{
					name: 'H1',
				},
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'L3',
				},
				{
					name: 'L3',
				},
			],
			[
				{
					name: 'L1',
				},
				{
					name: 'L2',
				},
				{
					name: 'L2',
				},
				{
					name: 'H1',
				},
				{
					name: 'H4',
				},
				{
					name: 'H4',
				},
				{
					name: 'H2',
				},
				{
					name: 'H3',
				},
				{
					name: 'H2',
				},
			],
			[
				{
					name: 'L3',
				},
				{
					name: 'L3',
				},
				{
					name: 'L3',
				},
				{
					name: 'H3',
				},
				{
					name: 'H1',
				},
				{
					name: 'L3',
				},
				{
					name: 'H3',
				},
				{
					name: 'H3',
				},
				{
					name: 'H2',
				},
			],
		],
		paddingPositions: [216, 205, 195, 16, 65, 30, 126],
		gameType: 'basegame',
		anticipation: [0, 0, 0, 0, 0, 0, 0],
	},
	setTotalWin: {
		type: 'setTotalWin',
		amount: 1000,
	},
	finalWin: {
		type: 'finalWin',
		amount: 0,
	},
	winInfo: {
		type: 'winInfo',
		totalWin: 220,
		wins: [
			{
				symbol: 'L3',
				clusterSize: 5,
				win: 20,
				positions: [
					{
						reel: 4,
						row: 6,
					},
					{
						reel: 5,
						row: 6,
					},
					{
						reel: 6,
						row: 6,
					},
					{
						reel: 6,
						row: 5,
					},
					{
						reel: 5,
						row: 5,
					},
				],
				meta: {
					globalMult: 1,
					clusterMult: 1,
					winWithoutMult: 0.2,
					overlay: {
						reel: 5,
						row: 5,
					},
				},
			},
			{
				symbol: 'H2',
				clusterSize: 5,
				win: 200,
				positions: [
					{
						reel: 3,
						row: 5,
					},
					{
						reel: 4,
						row: 5,
					},
					{
						reel: 4,
						row: 4,
					},
					{
						reel: 5,
						row: 4,
					},
					{
						reel: 5,
						row: 3,
					},
				],
				meta: {
					globalMult: 1,
					clusterMult: 1,
					winWithoutMult: 2.0,
					overlay: {
						reel: 4,
						row: 3,
					},
				},
			},
		],
	},
	updateTumbleWin: {
		type: 'updateTumbleWin',
		amount: 220,
	},
	tumbleBoard: {
		type: 'tumbleBoard',
		newSymbols: [
			[],
			[],
			[],
			[
				{
					name: 'H2',
				},
			],
			[
				{
					name: 'L1',
				},
				{
					name: 'L3',
				},
				{
					name: 'L3',
				},
			],
			[
				{
					name: 'H3',
				},
				{
					name: 'H4',
				},
				{
					name: 'H2',
				},
				{
					name: 'H3',
				},
			],
			[
				{
					name: 'L1',
				},
				{
					name: 'L3',
				},
			],
		],
		explodingSymbols: [
			{
				reel: 3,
				row: 5,
			},
			{
				reel: 4,
				row: 6,
			},
			{
				reel: 4,
				row: 5,
			},
			{
				reel: 4,
				row: 4,
			},
			{
				reel: 5,
				row: 6,
			},
			{
				reel: 5,
				row: 5,
			},
			{
				reel: 5,
				row: 4,
			},
			{
				reel: 5,
				row: 3,
			},
			{
				reel: 6,
				row: 6,
			},
			{
				reel: 6,
				row: 5,
			},
		],
	},
	setWin: {
		type: 'setWin',
		amount: 550,
		winLevel: 5,
	},
	freeSpinTrigger: {
		type: 'freeSpinTrigger',
		totalFs: 12,
		positions: [
			{
				reel: 0,
				row: 2,
			},
			{
				reel: 1,
				row: 1,
			},
			{
				reel: 4,
				row: 1,
			},
			{
				reel: 5,
				row: 4,
			},
			{
				reel: 6,
				row: 4,
			},
		],
	},
	updateFreeSpin: {
		type: 'updateFreeSpin',
		amount: 1,
		total: 12,
	},
	updateGlobalMult: {
		type: 'updateGlobalMult',
		globalMult: 3,
	},
	updateGrid: {
		type: 'updateGrid',
		gridMultipliers: [
			[0, 0, 0, 1, 0, 0, 0],
			[0, 0, 1, 1, 1, 0, 0],
			[0, 1, 1, 1, 1, 1, 0],
			[1, 1, 1, 2, 1, 1, 1],
			[0, 1, 1, 1, 1, 1, 0],
			[0, 0, 1, 1, 1, 0, 0],
			[0, 0, 0, 1, 0, 0, 0],
		],
	},
	freeSpinEnd: {
		type: 'freeSpinEnd',
		amount: 94270,
		winLevel: 9,
	},
	freeSpinRetrigger: {
		type: 'freeSpinRetrigger',
		totalFs: 20,
		positions: [
			{
				reel: 0,
				row: 3,
			},
			{
				reel: 3,
				row: 6,
			},
			{
				reel: 6,
				row: 3,
			},
		],
	},
};
