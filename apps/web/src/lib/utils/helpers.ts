export const tags = ["name", "publisher", "description", "tags"] as const;

export type TagObject = {
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

/**
 * Pads the date of stats to the current date
 * @param stats stats to pad
 * @param period period length in ms
 * @param sampleAmount amount of samples from period length
 * @returns padded stats
 */
export const padDate = (stats: { date: Date; views: number }[], period: number, sampleAmount: number) => {
	// get the current date in milliseconds
	const currentDateInMs = Date.now() - period;

	// create a new array with the same length as the sample amount
	const paddedStats = [...new Array(sampleAmount).keys()].reverse().map((e) => {
		// create a new date object from the current date in milliseconds minus the current iteration in milliseconds
		const time = new Date(currentDateInMs - e * period);

		// set the hours, minutes, seconds, and milliseconds to 0
		time.setUTCHours(0, 0, 0, 0);

		// return the date if it exists in the stats array, otherwise return the date and 0 views
		return (
			stats.find((f) => f.date === time) ?? {
				date: time,
				views: 0,
			}
		);
	});
	return paddedStats;
};
