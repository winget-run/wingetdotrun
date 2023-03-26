<script lang="ts">
	import Package from "$lib/components/package/package.svelte";
	import SearchBar from "$lib/components/search/search_bar.svelte";
	import { search } from "$lib/stores/search";
	import { Feed } from "svaria";

	export let data;

	const svg = `"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(213 219 249 / 0.08)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"`;
</script>

<svelte:head>
	<title>wingetdotrun | Finding winget packages made simple.</title>
	<meta
		name="description"
		content="Searching, discovering and installing winget packages made effortless without any third-party programs"
	/>
	<meta
		name="twitter:description"
		content="Searching, discovering and installing winget packages made effortless without any third-party programs"
	/>
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			"url": "https://winget.run/",
			"potentialAction": {
				"@type": "SearchAction",
				"target": {
					"@type": "EntryPoint",
					"urlTemplate": "https://winget.run/search?query={search_term_string}&utm_source=schemaSearch"
				},
				"query-input": "required name=search_term_string"
			}
		}
	</script>
</svelte:head>

<header class="relative pt-56 pb-20">
	<div
		class="absolute inset-0 h-[150%] w-full bg-bottom -z-1 bg-fixed"
		style="mask-image: radial-gradient(closest-side, black 50%, transparent 100%); background-image: url({svg});"
	/>

	<div class="container px-5 mx-auto relative">
		<span
			class="-z-10 absolute h-[64rem] w-[64rem] bg-gradient-radial from-primary top-1/2 right-1/3 transform -translate-y-1/2 opacity-50 mix-blend-hard-light"
		/>
		<span
			class="-z-10 absolute h-[64rem] w-[64rem] bg-gradient-radial from-secondary top-1/2 left-1/3 transform -translate-y-1/2 opacity-50  mix-blend-hard-light"
		/>

		<svg
			class="absolute left-1/2 -top-28 transform -translate-x-1/2 opacity-50 mix-blend-soft-light -z-10"
			width="270"
			height="307"
			viewBox="0 0 270 307"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M134.419 154.074V305M134.419 154.074L268 76.885M134.419 154.074L2 76.8849M134.419 305L268 230.115M134.419 305L2 230.115M268 76.885V230.115M268 76.885L134.419 2M268 230.115L206.437 194.399M134.419 2L2 76.8849M134.419 2V69.9715M2 76.8849V230.115M2 230.115L63.5629 194.399M63.5629 194.399L63.5628 112.601L134.419 69.9715M63.5629 194.399L134.419 234.724L206.437 194.399M206.437 194.399L206.437 112.601L134.419 69.9715"
				stroke="url(#paint0_radial_1240_927)"
				stroke-width="4"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<defs>
				<radialGradient
					id="paint0_radial_1240_927"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="translate(135 153.5) rotate(90) scale(151.5 133)"
				>
					<stop offset="0.557292" stop-color="white" stop-opacity="0.53" />
					<stop offset="1" stop-color="white" />
				</radialGradient>
			</defs>
		</svg>

		<h1 class="text-center font-bold text-white text-6xl mb-8">
			winget<span class="font-normal">dot</span>run
		</h1>
		<SearchBar class="mx-auto max-w-3xl" />
		<div class="text-center text-title mt-4">
			Examples:
			<button
				on:click={() => {
					search.setVisibility(true);
					$search.query = "tags:code";
				}}
				class="hover:text-white underline"
			>
				Coding
			</button>,{" "}
			<button
				on:click={() => {
					search.setVisibility(true);
					$search.query = "tags:browser";
				}}
				class="hover:text-white underline"
			>
				Web Browsers
			</button>,{" "}
			<button
				on:click={() => {
					search.setVisibility(true);
					$search.query = "publisher:microsoft";
				}}
				class="hover:text-white underline"
			>
				by Microsoft
			</button>
		</div>
	</div>
</header>

<div class="container px-5 mx-auto mb-20">
	<h2 id="featured-packages-title" class="text-2xl text-title font-bold mb-8">Featured Packages</h2>
	<Feed
		class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
		feedLabelId="popular-packages-title"
		isLoading={false}
	>
		{#each data.featured || [] as pack, i}
			<Package
				svariaProps={{
					index: i,
					itemCount: 8,
					labelId: `featured-${pack.id}`,
					descriptionId: `featured-${pack.id}-desc`,
				}}
				id={pack.wingetId}
				name={pack.name}
				publisher={pack.publisher}
				description={pack.description ?? undefined}
				featured={pack.featured}
				homepage={pack.homepage ?? undefined}
				logoUrl={pack.logoUrl ?? undefined}
			/>
		{/each}
	</Feed>
</div>

<div class="container px-5 mx-auto mb-20">
	<h2 id="popular-packages-title" class="text-2xl text-title font-bold mb-8">Most popular packages this month</h2>
	<Feed
		class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
		feedLabelId="popular-packages-title"
		isLoading={false}
	>
		{#each data.popular || [] as pack, i}
			<Package
				svariaProps={{
					index: i,
					itemCount: 8,
					labelId: `popular-${pack.id}`,
					descriptionId: `popular-${pack.id}-desc`,
				}}
				id={pack.wingetId}
				name={pack.name}
				publisher={pack.publisher}
				description={pack.description ?? undefined}
				featured={pack.featured}
				homepage={pack.homepage ?? undefined}
				logoUrl={pack.logoUrl ?? undefined}
			/>
		{/each}
	</Feed>
</div>

<div class="container px-5 mx-auto mb-20">
	<h2 id="recent-packages-title" class="text-2xl text-title font-bold mb-8">Most recently updated</h2>
	<Feed
		class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
		feedLabelId="recent-packages-title"
		isLoading={false}
	>
		{#each data.recent || [] as pack, i}
			<Package
				svariaProps={{
					index: i,
					itemCount: 8,
					labelId: `recent-${pack.id}`,
					descriptionId: `recent-${pack.id}-desc`,
				}}
				id={pack.wingetId}
				name={pack.name}
				publisher={pack.publisher}
				description={pack.description ?? undefined}
				featured={pack.featured}
				homepage={pack.homepage ?? undefined}
				logoUrl={pack.logoUrl ?? undefined}
			/>
		{/each}
	</Feed>
</div>
