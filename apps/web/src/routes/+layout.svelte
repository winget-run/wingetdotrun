<script lang="ts">
	import "../app.css";
	import { trpc } from "$lib/trpc/client";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import type { LayoutData, LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	const queryClient = trpc.hydrateQueryClient(data.trpc);
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>
