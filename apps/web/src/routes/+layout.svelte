<script lang="ts">
	import DownloadBar from "$lib/components/downloads/download_bar.svelte";
	import DownloadModal from "$lib/components/downloads/download_modal.svelte";
	import Footer from "$lib/components/footer/footer.svelte";
	import Nav from "$lib/components/nav/nav.svelte";
	import { downloadModalOpen, downloads } from "$lib/stores/downloads";
	import { search } from "$lib/stores/search";
	import { trpc } from "$lib/trpc/client";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { shortcut } from "svaria";
	import "tippy.js/animations/shift-away-subtle.css";
	import "tippy.js/dist/tippy.css";
	import "../app.css";
	import type { LayoutServerData } from "./$types";

	export let data: LayoutServerData;

	$: $downloads.items.length === 0 && downloadModalOpen.set(false);

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
	<div class="flex flex-col min-h-screen">
		<Nav />
		<main id="main" class="flex-1">
			<slot />
			<DownloadBar />
			<DownloadModal />
		</main>
		<Footer />
	</div>
</QueryClientProvider>
