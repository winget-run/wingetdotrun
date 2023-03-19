import { trpc } from "$lib/trpc/client";
import type { LayoutServerLoad } from "./$types";

export const load = (async (event) => {
	return {
		trpc: trpc.ssr(event),
		id: `${event.params.publisher}:${event.params.package}`,
	};
}) satisfies LayoutServerLoad;
