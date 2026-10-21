// Vault Breakers game config. Max win, max spot multiplier and bet modes live here.
// Paytable = math/design/handoff.json paytable_unscaled x base_pay_scale (2.0), per cluster-size bucket.
export default {
	"providerName": "vault_breakers",
	"gameName": "Vault Breakers",
	"gameID": "vault_breakers",
	"rtp": 0.962,
	"numReels": 5,
	"numRows": [
		5,
		5,
		5,
		5,
		5
	],
	"maxWin": 10000,
	"maxSpotMultiplier": 128,
	"vaultMeter": { "thresholds": [10, 20, 30] },
	"minClusterSize": 5,
	"freeSpins": {
		"3": 10,
		"4": 12,
		"5+": 15,
		"retrigger": 5
	},
	"betModes": {
		"base": {
			"key": "BASE",
			"cost": 1.0,
			"feature": true,
			"buyBonus": false,
			"rtp": 0.962,
			"max_win": 10000.0
		},
		"ante": {
			"key": "ANTE",
			"cost": 1.25,
			"feature": true,
			"buyBonus": false,
			"rtp": 0.962,
			"max_win": 10000.0,
			"scatterChanceMultiplier": 1.2
		},
		"bonus": {
			"key": "BONUS",
			"cost": 100,
			"feature": true,
			"buyBonus": true,
			"rtp": 0.962,
			"max_win": 10000.0
		},
		"super": {
			"key": "SUPER",
			"cost": 400,
			"feature": true,
			"buyBonus": true,
			"rtp": 0.962,
			"max_win": 10000.0,
			"startingSpotMultiplier": 2
		}
	},
	"symbols": {
		"H1": {
			"label": "Gold Bar",
			"paytable": {
				"5": 3.0,
				"6": 4.0,
				"7": 6.0,
				"8": 10.0,
				"9-10": 20.0,
				"11-12": 50.0,
				"13-15": 120.0,
				"16+": 300.0
			},
			"special_properties": []
		},
		"H2": {
			"label": "Diamond",
			"paytable": {
				"5": 2.0,
				"6": 3.0,
				"7": 5.0,
				"8": 8.0,
				"9-10": 16.0,
				"11-12": 36.0,
				"13-15": 90.0,
				"16+": 200.0
			},
			"special_properties": []
		},
		"H3": {
			"label": "Ruby",
			"paytable": {
				"5": 1.6,
				"6": 2.4,
				"7": 4.0,
				"8": 6.0,
				"9-10": 12.0,
				"11-12": 28.0,
				"13-15": 70.0,
				"16+": 160.0
			},
			"special_properties": []
		},
		"H4": {
			"label": "Emerald",
			"paytable": {
				"5": 1.2,
				"6": 2.0,
				"7": 3.0,
				"8": 5.0,
				"9-10": 10.0,
				"11-12": 20.0,
				"13-15": 50.0,
				"16+": 120.0
			},
			"special_properties": []
		},
		"L1": {
			"label": "A",
			"paytable": {
				"5": 0.8,
				"6": 1.0,
				"7": 1.6,
				"8": 2.4,
				"9-10": 4.0,
				"11-12": 10.0,
				"13-15": 24.0,
				"16+": 60.0
			},
			"special_properties": []
		},
		"L2": {
			"label": "K",
			"paytable": {
				"5": 0.6,
				"6": 0.8,
				"7": 1.2,
				"8": 2.0,
				"9-10": 3.2,
				"11-12": 8.0,
				"13-15": 20.0,
				"16+": 50.0
			},
			"special_properties": []
		},
		"L3": {
			"label": "Q",
			"paytable": {
				"5": 0.5,
				"6": 0.7,
				"7": 1.0,
				"8": 1.6,
				"9-10": 2.6,
				"11-12": 6.0,
				"13-15": 16.0,
				"16+": 40.0
			},
			"special_properties": []
		},
		"L4": {
			"label": "J",
			"paytable": {
				"5": 0.4,
				"6": 0.6,
				"7": 0.8,
				"8": 1.2,
				"9-10": 2.0,
				"11-12": 5.0,
				"13-15": 12.0,
				"16+": 30.0
			},
			"special_properties": []
		},
		"W": {
			"label": "Wild",
			"paytable": null,
			"special_properties": [
				"wild"
			]
		},
		"S": {
			"label": "Scatter (Vault)",
			"paytable": null,
			"special_properties": [
				"scatter"
			]
		}
	},
	"paddingReels": {
		"basegame": [],
		"freegame": []
	}
} as const;
