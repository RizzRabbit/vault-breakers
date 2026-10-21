import { ResizeObserver } from 'resize-observer';
import type { ContentRect as ContentRectType } from 'resize-observer/lib/ContentRect';

export type ContentRect = ContentRectType;

type OnChange = (contentRect: ContentRect) => void;

export function resizeObserver(node: HTMLElement, onChange: OnChange) {
	const resizeObserver = new ResizeObserver(([entry]) => {
		onChange(entry.contentRect);
	});

	resizeObserver.observe(node);

	return {
		destroy() {
			resizeObserver.disconnect();
		},
	};
}
