import type { Router } from "@wingetdotrun/trpc";
import { ssrLink } from "trpc-svelte-query/ssr";
import { createTRPCSvelte, httpBatchLink } from "trpc-svelte-query";
import { createTRPCProxyClient } from "@trpc/client";
import superjson from "superjson";
import { PUBLIC_TRPC_URL } from "$env/static/public";

// @ts-ignore
export const trpcSSR = createTRPCSvelte<Router>({
	links: [
		ssrLink(httpBatchLink)({
			url: PUBLIC_TRPC_URL,
		}),
	],
	transformer: superjson,
	queryClientConfig: {
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	},
});

export const trpc = createTRPCProxyClient<Router>({
	links: [
		httpBatchLink({
			url: PUBLIC_TRPC_URL,
		}),
	],
	transformer: superjson,
});
