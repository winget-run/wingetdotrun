export const tags = ["name", "publisher", "description", "tags"] as const;

type TagObject = {
	[key in (typeof tags)[number]]?: string;
} & {
	query?: string;
};

export const parseTags = (queryString: string): TagObject => {
	const queryObj: TagObject = {};
	let query = queryString.trim();

	for (const tag of tags) {
		const tagRegex = new RegExp(`(${tag}:(\\w+))`, "g");
		const matches = query.matchAll(tagRegex);

		for (const match of matches) {
			queryObj[tag] = match[2];
			query = query.replace(match[0], "");
		}
	}

	const remainingText = query.replace(/\s\s+/g, " ").trim();
	if (remainingText.length > 0) {
		queryObj.query = remainingText;
	}

	return queryObj;
};

// TODO: change stat type
/**
 * Pads the date of stats to the current date
 * @param stats stats to pad
 * @param period period length in ms
 * @param sampleAmount amount of samples from period length
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
