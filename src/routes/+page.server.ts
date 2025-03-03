import { makeClient } from "$lib/api/client";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ fetch }) => {
	const client = makeClient(fetch);
	const response = await client.search.$get({ query: { query: "vscode" } });

	if (!response.ok) {
		throw new Error("fuck this shit");
	}

	return {
		packages: await response.json(),
	};
}) satisfies PageServerLoad;

export const actions = {
	search: async ({ fetch, request }) => {
		const data = await request.formData();
		const query = data.get("query");

		if (query == null) {
			return {
				packages: [],
			};
		}

		const client = makeClient(fetch);
		const response = await client.search.$get({ query: { query: query.toString() } });

		if (!response.ok) {
			return {
				packages: [],
			};
		}

		return {
			packages: await response.json(),
		};
	},
} satisfies Actions;
