import type { Snippet } from 'svelte';

import type { ButtonProps } from 'components-pixi';

export type EmitterEventUi =
	| { type: 'hotKeySpace' }
	| { type: 'hotKeyEscape' }
	| { type: 'stopButtonClick' }
	| { type: 'stopButtonEnable' }
	| { type: 'uiShow' }
	| { type: 'uiHide' }
	| { type: 'drawerUnfold' }
	| { type: 'drawerFold' }
	| { type: 'drawerButtonShow' }
	| { type: 'drawerButtonHide' }
	// sound
	| { type: 'soundBetMode'; betModeKey: string }
	| { type: 'soundPressGeneral' }
	| { type: 'soundPressBet' }
	// bet services
	| { type: 'resumeBet' }
	| { type: 'autoBet' }
	| { type: 'bet' };

export type ButtonIcon =
	| 'decrease'
	| 'increase'
	| 'menu'
	| 'turbo'
	| 'autoSpin'
	| 'payTable'
	| 'info'
	| 'settings'
	| 'soundOn'
	| 'soundOff'
	| 'menuExit';

export type LayoutUiProps = {
	gameName: Snippet;
	logo: Snippet;
	amountBalance: Snippet<[{ stacked?: boolean }]>;
	amountWin: Snippet<[{ stacked?: boolean }]>;
	amountBet: Snippet<[{ stacked?: boolean }]>;
	buttonBuyBonus: Snippet<[Partial<ButtonProps>]>;
	buttonBet: Snippet<[Partial<ButtonProps>]>;
	buttonTurbo: Snippet<[Partial<ButtonProps>]>;
	buttonAutoSpin: Snippet<[Partial<ButtonProps>]>;
	buttonIncrease: Snippet<[Partial<ButtonProps>]>;
	buttonDecrease: Snippet<[Partial<ButtonProps>]>;
	buttonMenu: Snippet<[Partial<ButtonProps>]>;
	buttonMenuClose: Snippet<[Partial<ButtonProps>]>;
	buttonPayTable: Snippet<[Partial<ButtonProps>]>;
	buttonGameRules: Snippet<[Partial<ButtonProps>]>;
	buttonSettings: Snippet<[Partial<ButtonProps>]>;
	buttonSoundSwitch: Snippet<[Partial<ButtonProps>]>;
};
