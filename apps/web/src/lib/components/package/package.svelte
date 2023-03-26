<script lang="ts">
	// TODO: A lot of this is fucked
	// Should slot-ify this for maximum flexibility
	import { tippy } from "$lib/actions";
	import { downloads } from "$lib/stores/downloads";
	import type { TagObject } from "$lib/utils/helpers";
	import clsx from "clsx";
	import { FeedItem, prefersReducedMotion } from "svaria";
	import type { FeedItemProps } from "svaria/components/feed/feed_item.svelte";
	import IconPlus from "~icons/lucide/plus";
	import IconStar from "~icons/lucide/star";
	import PackageIcon from "./package_icon.svelte";

	export let id: string;
	export let name: string;
	export let publisher: string;
	export let description = "";
	export let logoUrl = "";
	export let homepage = "";
	export let featured = false;

	export let highlights: TagObject | undefined = undefined;
	export let svariaProps: FeedItemProps;

	$: selected = $downloads.items.find((x) => x.id === id);

	function addOrRemove() {
		if (selected) {
			downloads.remove(id);
		} else {
			downloads.add({ id: id, name: name, logo: logoUrl, homepage: homepage });
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
	{#if featured}
		<div
			class="absolute top-0 left-3 -translate-y-1/2 bg-primary text-card rounded-full px-2 h-5 text-xs font-semibold flex items-center gap-1"
		>
			<IconStar width={12} height={12} />
			Featured
		</div>
	{/if}

	<div class="flex items-center">
		<PackageIcon logo={logoUrl} {homepage} size={32} />
		<div class="flex-1 px-2.5">
			<h2 id={svariaProps.labelId} class="font-semibold text-title text-lg line-clamp-1 leading-tight break-all">
				<a href="/pkg/{id.replace('.', '/')}" class="hover:text-primary">
					{#if highlights}
						{@html name.replace(
							new RegExp(`(${highlights?.name ?? highlights?.query})`, "gi"),
							"<span class='bg-highlighter dark:bg-highlighter-dark rounded'>$1</span>",
						)}
					{:else}
						{name}
					{/if}
				</a>
			</h2>
			<a
				href="/search?publisher={id.split('.')[0]}"
				class="font-medium italic text-subtitle text-xs line-clamp-1 leading-tight hover:text-primary"
			>
				{publisher}
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
	{#if description}
		<p id={svariaProps.descriptionId} class="line-clamp-3 text-body dark:text-body-dark text-sm mt-5">
			{#if highlights}
				{@html description.replace(
					new RegExp(`(${highlights?.description ?? highlights?.query})`, "gi"),
					"<span class='bg-highlighter dark:bg-highlighter-dark rounded'>$1</span>",
				)}
			{:else}
				{description}
			{/if}
		</p>
	{/if}
</FeedItem>
