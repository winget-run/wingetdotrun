import type { Router } from "$lib/api/server";
import { hc } from "hono/client";

let browserClient: ReturnType<typeof hc<Router>>;

export const makeClient = (fetch: Window["fetch"]) => {
	const isBrowser = typeof window !== "undefined";
	const origin = isBrowser ? window.location.origin : "";

	if (isBrowser && browserClient) {
		return browserClient.api.v3;
	}

	const client = hc<Router>(origin, { fetch });

	if (isBrowser) {
		browserClient = client;
	}

	return client.api.v3;
};
