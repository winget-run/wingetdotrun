<script lang="ts">
	import { goto } from "$app/navigation";
	import { search } from "$lib/stores/search";
	import { parseTags } from "$lib/utils/helpers";
	import clsx from "clsx";
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
				/((name|publisher|description|tags):(\w+))/g,
				"<span class='bg-secondary/10 rounded'><span class='text-secondary'>$2</span>:$3</span>",
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

<!-- svelte-ignore a11y-click-events-have-key-events -->
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
	class={clsx(
		"relative z-30 flex h-16 w-full items-center rounded-lg border border-white/10 bg-card backdrop-blur backdrop-filter transition-colors",
		$search.visible ? "bg-opacity-80" : "bg-opacity-50",
		$$props.class,
	)}
>
	<IconSearch width={24} height={24} class="absolute left-5 top-1/2 -translate-y-1/2 transform text-primary" />
	<form
		class={clsx("relative h-full w-full", !$search.visible && "pr-20")}
		role="search"
		on:submit|preventDefault={viewAllResults}
	>
		<input
			bind:this={input}
			class={clsx(
				"relative h-full w-full bg-transparent font-medium text-title placeholder-body focus:outline-none pl-16",
			)}
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
			class="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-full overflow-hidden whitespace-nowrap font-medium text-transparent pl-16 align-middle"
			bind:this={content}
		>
			{@html contentHTML}
		</div>
	</form>

	{#if !$search.visible}
		<kbd
			class="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 transform rounded border border-b-2 border-current px-1.5 py-1 text-xs font-semibold leading-none text-body"
		>
			CTRL+K
		</kbd>
	{/if}

	{#if $search.visible}
		<p id="search-component-label" class="sr-only">Search Results</p>
		<Feed
			feedLabelId="search-component-label"
			isLoading={isSearching}
			class="absolute -bottom-2 left-0 max-h-screen w-full translate-y-full transform"
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
						class="mb-2 flex h-full w-full flex-col items-center rounded-xl border bg-white p-5 text-center shadow-card"
					>
						<h3 class="text-2xl font-semibold text-primary">No packages found</h3>
						<p class="max-w-96 mt-2.5 text-center text-body">
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
							class="| hover:bg-primary-10 inline-flex h-11 w-full items-center justify-center rounded-lg bg-white px-4 text-lg font-semibold text-primary shadow-card transition-colors focus:outline-none"
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
							class="| hover:bg-primary-60 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-lg font-semibold text-white shadow-card transition-colors focus:outline-none"
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
