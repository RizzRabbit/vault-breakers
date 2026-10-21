import _ from 'lodash';

import type { BaseBookEvent } from './types';

const createMultiBookUtils = () => {
	function splitBookToRounds<TBookEvent extends BaseBookEvent>({
		book,
		splitBy,
	}: {
		book: TBookEvent[];
		splitBy: TBookEvent['type'][];
	}) {
		const rounds = book.reduce((acc, cur, curIndex, arr) => {
			if (splitBy.includes(cur.type) || curIndex === arr.length - 1) {
				const previousEvents = _.flatten(_.flatten(acc));
				const startIndex = previousEvents.length;
				const slice = arr.slice(startIndex, curIndex);

				if (slice.length !== 0) acc.push(slice);
				acc.push([cur]); // A "splitBy" event will always be an independent round

				return acc;
			}

			return acc;
		}, [] as TBookEvent[][]);

		return rounds;
	}

	function booksToRounds<TBookEvent extends BaseBookEvent>({
		books,
		splitBy,
	}: {
		books: TBookEvent[][];
		splitBy: TBookEvent['type'][];
	}) {
		const roundsList = books.map((book) => splitBookToRounds({ book, splitBy }));
		const roundsLength = Math.max(...roundsList.map((rounds) => rounds.length));
		const mergedRounds = _.range(roundsLength).map((_, roundIndex) => {
			const mergedRound = roundsList.map((rounds) => rounds?.[roundIndex] || []);
			return mergedRound;
		});

		return mergedRounds;
	}

	function roundsToBooks<TBookEvent extends BaseBookEvent>({
		rounds,
	}: {
		rounds: TBookEvent[][][];
	}) {
		const books = rounds.reduce((acc, cur) => {
			cur.forEach((book, bookIndex) => {
				if (acc[bookIndex] === undefined) acc[bookIndex] = [];
				acc[bookIndex] = [...acc[bookIndex], ...book];
			});

			return acc;
		}, [] as TBookEvent[][]);

		return books;
	}

	return { booksToRounds, roundsToBooks };
};

export { createMultiBookUtils };
