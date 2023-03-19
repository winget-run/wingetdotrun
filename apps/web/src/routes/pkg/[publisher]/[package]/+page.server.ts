import { trpc } from "$lib/trpc/client";
import type { PageServerLoad } from "./$types";

export const load = (async (event) => {
	const { params } = event;

	const pkg = await trpc.packages.find.ssr({ id: `${params.publisher}.${params.package}` }, event);
	const stats = await trpc.stats.find.ssr({ id: `${params.publisher}.${params.package}` }, event);

	return { package: pkg?.data, stats: stats?.data };
}) satisfies PageServerLoad;
