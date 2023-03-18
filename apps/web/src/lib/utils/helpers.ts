/**
 * Parses a search query string into an array of tags
 * @param query Search query string
 * @returns Array of tags
 */
export const parseTagMatches = (query: string): string[] => {
	const taglist = ["name", "publisher", "description", "tags"];

	const tags = taglist
		.map((e) => query.indexOf(`${e}:`))
		.filter((e) => e !== -1)
		.sort((a, b) => a - b);
	if (tags.length === 0) {
		return [`query:${query}`];
	}

	return tags.map((e, i, a) => query.slice(e, a[i + 1] ?? query.length).trim());
};

/**
 * Parses a search query string into an object of tags
 * @param q Search query string
 * @returns Object of tags
 */
export const parseTags = (
	q: string,
): {
	query?: string;
	name?: string;
	publisher?: string;
	description?: string;
	tags?: string;
	sort?: string;
	order?: string;
} => {
	const data = parseTagMatches(q);

	const final = data.reduce((a, c) => {
		const [tag, query] = c.split(":");
		return { ...a, [tag.trim()]: query.trim() };
	}, {});

	return final;
};

// TODO: change stat type
/**
 * Pads the date of stats to the current date
 * @param stats stats to pad
 * @param period period of the stats
 * @param sampleAmount amount of samples to pad
 * @returns padded stats
 */
export const padDate = (stats: { period: string; value: number }[], period: number, sampleAmount: number) => {
	const currentDateInMs = Date.now() - period;
	const paddedStats = [...new Array(sampleAmount).keys()].reverse().map((e) => {
		const time = new Date(currentDateInMs - e * period);
		time.setUTCHours(0, 0, 0, 0);

		return (
			stats.find((f) => f.period === time.toISOString()) ?? {
				period: time.toISOString(),
				value: 0,
			}
		);
	});
	return paddedStats;
};
