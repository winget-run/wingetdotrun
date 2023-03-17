import { trpc } from "$lib/trpc/client";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	return {
		trpc: trpc.ssr(event),
	};
};
