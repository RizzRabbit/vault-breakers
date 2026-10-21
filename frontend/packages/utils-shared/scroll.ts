import { waitForTimeout } from './wait';

export const scrollIntoView = async ({
	element,
	duration,
}: {
	element: HTMLDivElement;
	duration: number;
}) => {
	if (!element) return;
	await waitForTimeout(duration + 20);
	element.scroll({
		top: element.scrollHeight,
		behavior: 'smooth',
	});
};
