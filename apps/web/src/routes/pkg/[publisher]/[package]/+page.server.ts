import { trpc } from "$lib/trpc/client";
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";

export const load = (async (event) => {
	const { params } = event;

	const data = await trpc.util.package.ssr({ id: "79fdb5dd-92e4-449c-86df-260cf388af03" }, event);

	if (!data || !data.data) {
		throw error(404, "Not found");
	}

	return { id: `${params.publisher}.${params.package}`, pack: data.data, publisher: params.publisher };
}) satisfies PageServerLoad;
