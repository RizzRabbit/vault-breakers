import { setContext, getContext } from 'svelte';

import { createLayout } from './createLayout.svelte';

type ContextLayout = ReturnType<typeof createLayout>;

const LAYOUT_NS = '@@layout';
export function setContextLayout(value: ContextLayout) {
	setContext(LAYOUT_NS, value);
}
export function getContextLayout() {
	return getContext(LAYOUT_NS) as ContextLayout;
}
