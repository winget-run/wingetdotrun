import { trpc } from "../lib/trpc/client";
import type { PageLoad } from "./$types";

export const load = (async () => {
	const data = await trpc.util.featured.query({ featured: 8, popular: 8, recent: 8 });

	if (!data) {
		return {
			featured: [],
			popular: [],
			recent: [],
		};
	}

	return data.data;
}) satisfies PageLoad;
