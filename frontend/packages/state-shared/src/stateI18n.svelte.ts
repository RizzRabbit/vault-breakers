import { i18n, type Messages } from '@lingui/core';
import { type Language } from './stateUrl.svelte';

export const stateI18n = $state({
	i18n
});

export const stateI18nDerived = {
	init: (lang: Language, messages: Messages) => {
		stateI18n.i18n.load(lang, messages as Messages);
		stateI18n.i18n.activate(lang);
	},
	translate: (value: string) => stateI18n.i18n._(stateI18n.i18n.t(value)),
};