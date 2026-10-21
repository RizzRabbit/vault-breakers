// Optional per-game skin for the shared Pixi UI (presentation only; no bet/RGS logic).
// A game calls setUiSkin() once at start-up. With no skin set, the SDK defaults render unchanged.
import type { Component } from 'svelte';

export type UiPlateProps = Record<string, any> & { key?: string };

export type UiSkin = {
	// replaces the default Rectangle used for every button/label plate (UiSprite)
	plate?: Component<UiPlateProps>;
	// text colours for button captions, label titles and label values
	buttonText?: number;
	labelText?: number;
	valueText?: number;
	fontFamily?: string;
};

export const uiSkin: UiSkin = {};

export const setUiSkin = (skin: UiSkin) => Object.assign(uiSkin, skin);
