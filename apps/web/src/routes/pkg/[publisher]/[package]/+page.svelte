<script lang="ts">
	import { tippy } from "$lib/actions";
	import Button from "$lib/components/button/button.svelte";
	import Codeblock from "$lib/components/codeblock/codeblock.svelte";
	import Graph from "$lib/components/graph/graph.svelte";
	import PackageIcon from "$lib/components/package/package_icon.svelte";
	import VersionList from "$lib/components/version_list/version_list.svelte";
	import { downloads } from "$lib/stores/downloads";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import { padDate } from "$lib/utils/helpers";
	import clsx from "clsx";
	import IconCalendar from "~icons/lucide/calendar";
	import IconGlobe from "~icons/lucide/globe";
	import IconPlus from "~icons/lucide/plus";
	import IconScale from "~icons/lucide/scale";

	export let data;
	$: ({ pack } = data);

	let selectedDateIdx: number | null = null;
	let graphWidth: number;

	$: dates = padDate(pack.views, 1000 * 60 * 60 * 24, 7);
	$: selectedDate = selectedDateIdx !== null ? dates[selectedDateIdx] : undefined;
	$: isSelected = $downloads.items.find((x) => x.id === pack.id);

	function addOrRemove() {
		if (isSelected) {
			downloads.remove(pack.id);
		} else {
			downloads.add({
				id: pack.id,
				name: pack.name,
				version: pack.versions[0],
				logo: pack.logoUrl,
				homepage: pack.homepage,
			});
		}
	}
</script>

<svelte:head>
	<title>Download and install {pack.name} with winget</title>
	<meta
		name="description"
		content={pack.description || `Download and install ${pack.name} and other packages with winget`}
	/>
	<meta name="twitter:title" content="{pack.name} on winget.run" />
	<meta
		name="twitter:description"
		content={pack.description || `Download and install ${pack.name} and other packages with winget`}
	/>
</svelte:head>

<header
	class={clsx(
		"mx-auto max-w-[1920px] bg-cover bg-center bg-no-repeat",
		pack.bannerUrl ? "-mb-20 pt-52 pb-32" : "pt-36 pb-8",
	)}
	style={pack.bannerUrl
		? `background-image: linear-gradient(180deg, rgba(36, 40, 57, 0.65) 19.27%, #242839 100%), url(${pack.bannerUrl});`
		: undefined}
>
	<div class="container mx-auto flex w-full px-5">
		<PackageIcon logo={pack.logoUrl ?? undefined} homepage={pack.homepage ?? undefined} size={96} />
		<div class="ml-8">
			<h1 class="mt-2 text-4xl font-semibold leading-none text-white lg:text-5xl">
				{pack.name}
				{#if pack.featured}
					<svg
						use:tippy={{ content: "Featured Package" }}
						class="inline-block align-top"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22.0005 9.6699C21.9373 9.48699 21.8224 9.32633 21.6698 9.2074C21.5171 9.08848 21.3333 9.0164 21.1405 8.9999L15.4505 8.1699L12.9005 2.9999C12.8186 2.83083 12.6907 2.68824 12.5316 2.58847C12.3724 2.48871 12.1883 2.43579 12.0005 2.43579C11.8126 2.43579 11.6286 2.48871 11.4694 2.58847C11.3102 2.68824 11.1824 2.83083 11.1005 2.9999L8.55047 8.1599L2.86047 8.9999C2.67539 9.02621 2.50139 9.10386 2.35822 9.22406C2.21504 9.34425 2.10843 9.50218 2.05047 9.6799C1.99741 9.85358 1.99265 10.0384 2.03669 10.2146C2.08074 10.3908 2.17192 10.5516 2.30047 10.6799L6.43047 14.6799L5.43047 20.3599C5.39477 20.5474 5.41346 20.7412 5.48434 20.9184C5.55522 21.0955 5.67532 21.2488 5.83047 21.3599C5.98168 21.468 6.16004 21.5318 6.34551 21.5442C6.53099 21.5566 6.71624 21.517 6.88047 21.4299L12.0005 18.7599L17.1005 21.4399C17.2408 21.5191 17.3993 21.5604 17.5605 21.5599C17.7723 21.5607 17.9789 21.4941 18.1505 21.3699C18.3056 21.2588 18.4257 21.1055 18.4966 20.9284C18.5675 20.7512 18.5862 20.5574 18.5505 20.3699L17.5505 14.6899L21.6805 10.6899C21.8248 10.5676 21.9316 10.4068 21.9882 10.2262C22.0448 10.0457 22.0491 9.85278 22.0005 9.6699Z"
							fill="#ECB22E"
						/>
					</svg>
				{/if}
			</h1>
			<a
				href="/pkg/{pack.wingetId.split('.')[0]}"
				class="mt-2 inline-block text-2xl font-medium italic leading-none text-title"
			>
				{pack.publisher}
			</a>
		</div>
	</div>
</header>

<div class="container mx-auto w-full px-5">
	<div class="flex flex-col-reverse gap-8 lg:flex-row xl:gap-16">
		<div class="w-full flex-shrink-0 lg:max-w-sm">
			<Button on:click={addOrRemove} class="mb-5 w-full" outlined={!isSelected} let:iconSize>
				<IconPlus class="transform {isSelected && 'rotate-45'}" width={iconSize} height={iconSize} />
				{isSelected ? "Remove this package" : "Add this package"}
			</Button>

			<div
				class="mb-5 flex w-full flex-col overflow-hidden rounded-lg border border-white/10 bg-card bg-opacity-50 transition-all"
			>
				{#if pack.tags && pack.tags.length > 0}
					<section class="mb-10 px-6 pt-5">
						<h2 class="mb-2 text-xl font-semibold leading-tight text-title">Tags</h2>
						<div class="-mb-2 flex flex-wrap gap-2">
							{#each pack.tags as tag}
								<a
									href="/search?tags={encodeURIComponent(tag)}"
									rel="nofollow"
									class="whitespace-nowrap rounded border border-primary px-2.5 py-2 text-sm font-medium leading-none text-primary transition hover:bg-primary hover:bg-opacity-10 active:scale-90"
								>
									{tag}
								</a>
							{/each}
						</div>
					</section>
				{/if}
				<section bind:offsetWidth={graphWidth} class="pt-5">
					{#if selectedDate}
						<h2 class="px-6 text-xl font-semibold leading-tight text-title">
							{selectedDate.views !== 1 ? `${selectedDate.views} views` : `1 view`}
						</h2>
						<h3 class="px-6 text-sm font-medium italic text-subtitle">
							{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(selectedDate.date)}
						</h3>
					{:else}
						{@const views = dates.reduce((a, c) => a + c.views, 0)}
						<h2 class="px-6 text-xl font-semibold leading-tight text-title">
							{views !== 1 ? `${views} views` : `1 view`}
						</h2>
						<h3 class="px-6 text-sm font-medium italic text-subtitle">In the last 7 days</h3>
					{/if}

					<Graph
						class="w-full text-primary"
						stats={dates.map((x) => x.views)}
						bind:selected={selectedDateIdx}
						verticalPadding={20}
						height={120}
						width={graphWidth}
					/>
				</section>
			</div>

			<div class="w-full rounded-lg border border-white/10 bg-card bg-opacity-50 transition-all">
				<h2 class="mb-2 p-5 pb-1 text-xl font-semibold leading-tight text-title">Versions</h2>
				<VersionList {pack} class="px-2.5 pb-5" />
			</div>
		</div>

		<div class="flex flex-1 flex-col gap-10">
			<!-- Code snippet -->
			<section>
				<h2 class="mb-2 text-2xl font-semibold leading-tight text-title">How to install</h2>
				<Codeblock code={mapDownloadsToCommands([{ ...pack, id: pack.wingetId }])} class="mb-3 w-full" />
			</section>

			<!-- Description -->
			{#if pack.description}
				<section>
					<h2 class="mb-2 text-2xl font-semibold leading-tight text-title">About</h2>
					<p class="text-lg text-body">{pack.description}</p>
				</section>
			{/if}

			<section>
				<div class="flex gap-8 w-full">
					<!-- Updated Date -->
					<article
						class="relative flex-1 flex flex-col items-start justify-between gap-3 rounded-lg border border-white/10 bg-card p-5 hover:bg-card-hover"
					>
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary bg-opacity-10 text-primary">
							<IconCalendar width={24} height={24} />
						</div>

						<div>
							<p class="font-medium leading-normal text-subtitle">Last updated on</p>
							<h3 class="text-xl font-bold text-title">
								{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(pack.updatedAt))}
							</h3>
						</div>
					</article>

					<!-- Website -->
					{#if pack.homepage}
						<a
							href={pack.homepage}
							rel="nofollow"
							class="relative flex-1 flex flex-col items-start justify-between gap-3 rounded-lg border border-white/10 bg-card p-5 hover:bg-card-hover"
						>
							<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary bg-opacity-10 text-primary">
								<IconGlobe width={24} height={24} />
							</div>

							<div>
								<p class="font-medium leading-normal text-subtitle">{new URL(pack.homepage).hostname}</p>
								<h3 class="text-xl font-bold text-title">Visit Website</h3>
							</div>
						</a>
					{/if}

					<!-- License -->
					{#if pack.license || pack.licenseUrl}
						<svelte:element
							this={pack.licenseUrl ? "a" : "article"}
							href={pack.licenseUrl}
							rel="nofollow"
							class="relative flex-1 flex flex-col items-start justify-between gap-3 rounded-lg border border-white/10 bg-card p-5 hover:bg-card-hover"
						>
							<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary bg-opacity-10 text-primary">
								<IconScale width={24} height={24} />
							</div>

							<div>
								<p class="font-medium leading-normal text-subtitle">Licensed under</p>
								<h3 class="text-xl font-bold text-title">{pack.license ?? "Unlicensed"}</h3>
							</div>
						</svelte:element>
					{/if}
				</div>
			</section>
		</div>
	</div>
</div>
