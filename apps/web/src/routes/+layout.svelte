<script lang="ts">
	import Nav from "$lib/components/nav/nav.svelte";
	import { search } from "$lib/stores/search";
	import { trpc } from "$lib/trpc/client";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { shortcut } from "svaria";
	import "tippy.js/animations/shift-away-subtle.css";
	import "tippy.js/dist/tippy.css";
	import "../app.css";
	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	const queryClient = trpc.hydrateQueryClient(data.trpc);
</script>

<svelte:body
	use:shortcut={[
		{
			key: "k",
			ctrlKey: true,
			callback: () => search.setVisibility(true),
		},
	]}
/>

<QueryClientProvider client={queryClient}>
	<Nav />
	<main>
		<slot />
	</main>
</QueryClientProvider>
