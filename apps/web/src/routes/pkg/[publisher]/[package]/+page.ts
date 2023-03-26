import { trpc } from "$lib/trpc/client";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ params }) => {
	const data = await trpc.util.package.query({ wingetId: `${params.publisher}.${params.package}` });

	if (!data || !data.data) throw error(404, "Package not found");

	return {
		pack: data.data,
	};
}) satisfies PageLoad;
