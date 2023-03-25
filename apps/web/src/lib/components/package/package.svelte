<script lang="ts">
	// TODO: A lot of this is fucked
	// Should slot-ify this for maximum flexibility

	// import { downloads } from "$lib/stores/packages";
	// import { searchOpen } from "$lib/stores/ui";
	// import type { ISearchFilters } from "$lib/types/search";
	import { FeedItem, prefersReducedMotion } from "svaria";
	import type { FeedItemProps } from "svaria/components/feed/feed_item.svelte";
	import IconPlus from "~icons/lucide/plus";
	import PackageIcon from "./package_icon.svelte";
	import clsx from "clsx";
	import type z from "zod";
	import type { packageModel } from "@wingetdotrun/prisma/zod";
	import { tippy } from "$lib/actions";
	import { downloads } from "$lib/stores/downloads";
	import IconStar from "~icons/lucide/star";

	export let pack: z.infer<typeof packageModel>;
	export let highlights: any;
	// export let highlights: ISearchFilters | undefined = undefined;
	export let svariaProps: FeedItemProps;

	$: selected = $downloads.items.find((x) => x.id === pack.id);
	$: [publisher, ...name] = pack.id.split(".");

	function addOrRemove() {
		if (selected) {
			downloads.remove(pack.id);
		} else {
			downloads.add({ id: pack.id, name: pack.name, logo: pack.logo, homepage: pack.homepage });
		}
	}
</script>

<FeedItem
	{...svariaProps}
	class={clsx(
		"bg-card bg-opacity-50 backdrop-filter backdrop-blur rounded-lg h-full w-full border p-6",
		$prefersReducedMotion ? "transition-opacity" : "transition-all",
		selected ? "shadow-md shadow-primary/20 border-primary bg-opacity-80" : "border-white/10",
	)}
>
	{#if pack.featured}
		<div
			class="absolute top-0 left-3 -translate-y-1/2 bg-primary text-card rounded-full px-2 h-5 text-xs font-semibold flex items-center gap-1"
		>
			<IconStar width={12} height={12} />
			Featured
		</div>
	{/if}

	<div class="flex items-center">
		<PackageIcon logo={pack.logo} homepage={pack.homepage} size={32} />
		<div class="flex-1 px-2.5">
			<h2 id={svariaProps.labelId} class="font-semibold text-title text-lg line-clamp-1 leading-tight break-all">
				<a href="/pkg/{publisher}/{name.join('.')}" class="hover:text-primary">
					{#if highlights}
						{@html pack.name.replace(
							new RegExp(`(${highlights?.name ?? highlights?.query})`, "gi"),
							"<span class='bg-highlighter dark:bg-highlighter-dark rounded'>$1</span>",
						)}
					{:else}
						{pack.name}
					{/if}
				</a>
			</h2>
			<a
				href="/pkg/{publisher}"
				class="font-medium italic text-subtitle text-xs line-clamp-1 leading-tight hover:text-primary"
			>
				{pack.publisherId}
			</a>
		</div>
		<button
			use:tippy={{
				content: selected ? "Remove this package" : "Add this package",
				delay: [1000, 0],
				hideOnClick: "toggle",
				placement: "top",
			}}
			on:click={addOrRemove}
			class={clsx(
				"rounded-full w-8 h-8 flex items-center justify-center focus:outline-none transform transition bg-primary",
				selected ? "text-card rotate-[135deg]" : "bg-opacity-10 text-primary",
			)}
		>
			<IconPlus width={24} height={24} />
		</button>
	</div>
	{#if pack.description}
		<p id={svariaProps.descriptionId} class="line-clamp-3 text-body dark:text-body-dark text-sm mt-5">
			{#if highlights}
				{@html pack.description.replace(
					new RegExp(`(${highlights?.description ?? highlights?.query})`, "gi"),
					"<span class='bg-highlighter dark:bg-highlighter-dark rounded'>$1</span>",
				)}
			{:else}
				{pack.description}
			{/if}
		</p>
	{/if}
</FeedItem>
