<script lang="ts">
	import { goto } from "$app/navigation";
	import { search } from "$lib/stores/search";
	import { parseTags } from "$lib/utils/helpers";
	import { clickoutside, contextual, Feed, prefersReducedMotion } from "svaria";
	import { flip } from "svelte/animate";
	import { backOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import IconAngleDown from "~icons/lucide/chevron-down";
	import IconArrowRight from "~icons/lucide/chevron-right";
	import IconSearch from "~icons/lucide/search";
	import Package from "../package/package.svelte";
	import SearchOptions from "./search_options.svelte";

	let input: HTMLInputElement;
	let content: HTMLDivElement;

	let isSearching = false;
	let moreOptionsOpen = false;

	let timeout = undefined;
	let calling = false;

	function debounce(fn: Function) {
		if (calling) return;
		calling = true;
		timeout = setTimeout(() => {
			fn();
			calling = false;
		}, 400);
	}

	$: contentHTML = $search.query
		? $search.query.replace(
				/(name|publisher|description|tags):/g,
				"<span class='bg-primary bg-opacity-10 text-primary rounded'>$1:</span>",
		  )
		: "";

	$: {
		if ($search.query && $search.query?.length >= 2) {
			debounce(() => $search.query && performSearch($search.query));
		} else {
			// search.results.set(undefined);
		}
	}

	$: {
		if ($search.visible) input.focus();
	}

	function handleInputScroll(
		e: UIEvent & {
			currentTarget: EventTarget & HTMLInputElement;
		},
	) {
		content.scrollLeft = e.currentTarget.scrollLeft;
	}

	async function performSearch(query: string) {
		isSearching = true;
		// const { order, ...tags } = parseTags(query);

		// await $api
		// 	.packages({
		// 		ensureContains: "true",
		// 		partialMatch: "true",
		// 		take: "3",
		// 		...tags,
		// 	})
		// 	.then(search.results.set)
		// 	.finally(() => (isSearching = false));
	}

	function viewAllResults() {
		// const { order, sort, ...tags } = parseTags(value);
		// const params = new URLSearchParams({
		// 	...tags,
		// });
		// search.setVisibility(false);
		// goto(`/search?${params.toString()}`);
	}

	$: flyAmount = $prefersReducedMotion ? 0 : 10;
</script>

<div
	use:clickoutside={() => search.setVisibility(false)}
	use:contextual={{
		id: "search",
		shortcuts: [
			{
				key: "Escape",
				callback: () => {
					search.setVisibility(false);
					input.blur();
				},
			},
			{
				key: "k",
				ctrlKey: true,
				callback: (e) => {
					e.preventDefault();
					search.setVisibility(true);
					input.focus();
				},
			},
		],
	}}
	class={[
		"w-full h-16 flex items-center px-6 relative z-30 bg-card backdrop-filter backdrop-blur border border-white/10 rounded-lg transition-colors",
		$search.visible ? "bg-opacity-80" : "bg-opacity-50",
		$$props.class,
	]
		.filter(Boolean)
		.join(" ")}
>
	<IconSearch width={24} height={24} class="text-primary mr-3" />
	<div class="flex-1 relative {!$search.visible && 'pr-20'}">
		<form class="relative" role="search" on:submit|preventDefault={viewAllResults}>
			<input
				bind:this={input}
				class="w-full h-full text-title placeholder-sub focus:outline-none relative bg-transparent | font-medium"
				bind:value={$search.query}
				on:focus={() => search.setVisibility(true)}
				on:blur={() => !($search.results && $search.results.length === 0) && search.setVisibility(false)}
				on:scroll={handleInputScroll}
				type="search"
				placeholder="Search 4000+ packages"
				spellcheck="false"
				autocomplete="false"
			/>
			<div
				class="w-full h-full absolute left-0 top-0 text-transparent overflow-hidden whitespace-nowrap | font-medium pointer-events-none"
				bind:this={content}
			>
				{@html contentHTML}
			</div>
		</form>
		{#if !$search.visible}
			<kbd
				class="text-xs text-subtitle font-semibold leading-none rounded px-1.5 py-1 border border-b-2 border-current pointer-events-none | absolute right-0 top-1/2 transform -translate-y-1/2"
			>
				CTRL+K
			</kbd>
		{/if}
	</div>

	<p id="search-component-label" class="sr-only">Search Results</p>

	{#if $search.visible}
		<Feed
			feedLabelId="search-component-label"
			isLoading={isSearching}
			class="absolute max-h-screen w-full -bottom-2 left-0 transform translate-y-full"
		>
			{#if $search.results}
				{#each $search.results.Packages as pack, i (pack.Id)}
					<div
						class="mb-2"
						in:fly={{
							y: flyAmount,
							delay: $prefersReducedMotion ? 0 : i * 50,
							easing: backOut,
						}}
						animate:flip={{
							duration: $prefersReducedMotion ? 0 : 250,
							easing: backOut,
						}}
					>
						<Package
							{pack}
							svariaProps={{
								index: i,
								itemCount: $search.results.Packages.length,
								labelId: `search-component-${pack.Id}`,
								descriptionId: `search-component-${pack.Id}-desc`,
							}}
							highlights={parseTags(value)}
						/>
					</div>
				{/each}

				{#if $search.results.Total === 0}
					<div
						in:fly={{
							y: flyAmount,
							easing: backOut,
						}}
						class="bg-white rounded-xl h-full w-full border p-5 shadow-card mb-2 text-center flex flex-col items-center"
					>
						<h3 class="text-2xl font-semibold text-primary">No packages found</h3>
						<p class="text-body text-center max-w-96 mt-2.5">
							Try searching for another term, or narrow down your search using the filters.
						</p>
					</div>
					<SearchOptions delay={50} />
				{:else}
					<div class="grid grid-cols-2 gap-2">
						<button
							on:click={() => (moreOptionsOpen = !moreOptionsOpen)}
							in:fly={{
								y: flyAmount,
								delay: $prefersReducedMotion ? 0 : $search.results.Packages.length * 50 + 50,
								easing: backOut,
							}}
							class="w-full h-11 px-4 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-white hover:bg-primary-10 transition-colors text-primary font-semibold text-lg shadow-card"
						>
							{moreOptionsOpen ? "Less options" : "More options"}
							<IconAngleDown class="ms-3 transform {moreOptionsOpen && 'rotate-180'}" width={24} height={24} />
						</button>
						<button
							on:click={() => {
								$search.results?.Total === 1 ? null : viewAllResults();
							}}
							in:fly={{
								y: flyAmount,
								delay: $prefersReducedMotion ? 0 : $search.results.Packages.length * 50 + 100,
								easing: backOut,
							}}
							class="w-full h-11 px-4 inline-flex items-center justify-center rounded-lg focus:outline-none | bg-primary hover:bg-primary-60 transition-colors text-white font-semibold text-lg shadow-card"
						>
							{$search.results.total === 1 ? "View result" : `View all ${$search.results.total} results`}
							<IconArrowRight class="ms-3" width={24} height={24} />
						</button>
						{#if moreOptionsOpen}
							<SearchOptions class="col-span-2" />
						{/if}
					</div>
				{/if}
			{:else}
				<SearchOptions />
			{/if}
		</Feed>
	{/if}
</div>
