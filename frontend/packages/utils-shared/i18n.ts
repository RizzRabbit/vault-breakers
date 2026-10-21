import _ from 'lodash';
import type { Messages } from '@lingui/core';

import type { Language } from 'state-shared';

export type MessagesMap = Record<Language, Messages>;

export const mergeMessagesMaps = (messagesMapList: MessagesMap[]) => {
	const merged = messagesMapList
		.filter(Boolean)
		.reduce((acc, current) => _.merge(acc, current), {} as MessagesMap);

	return merged;
};
