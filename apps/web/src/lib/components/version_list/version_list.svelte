<script lang="ts">
	import { tippy } from "$lib/actions";
	import { downloads } from "$lib/stores/packages";
	import type { IPackage } from "$lib/types/package";
	import VirtualList from "svelte-tiny-virtual-list";
	import { get } from "svelte/store";
	import IconPen from "~icons/lucide/pen";
	import IconPlus from "~icons/lucide/plus";
	import IconPackage from "~icons/lucide/package";
	import Clipboard from "./clipboard.svelte";

	export let pack: IPackage;
	$: selected = $downloads.find((x) => x.package.Id === pack.Id);

	function addToSelected(version: string) {
		if (selected) {
			let newDownloads = get(downloads);
			const index = newDownloads.findIndex((x) => x.package.Id === pack.Id);
			newDownloads[index] = { ...newDownloads[index], version };
			downloads.set(newDownloads);
		} else {
			downloads.update((x) => [...x, { package: pack, version }]);
		}
	}
</script>

<div class="list {$$props.class}">
	<VirtualList
		width="100%"
		height={Math.min(32 * 6, Math.max(2, pack.Versions.length) * 32)}
		itemCount={pack.Versions.length}
		itemSize={32}
	>
		<div
			role="listitem"
			slot="item"
			let:index
			let:style
			class="flex items-center justify-between px-2.5 pr-1.5 py-1 text-body dark:text-body-dark hover:bg-grey-10 dark:hover:bg-dark-600 rounded"
			{style}
		>
			<p class="truncate text-sm">{pack.Versions[index]}</p>
			<div class="flex items-center">
				<button class="px-1 h-full hover:text-primary focus:outline-none" use:tippy={{ content: "Package Manifest" }}>
					<IconPackage width={20} height={20} />
				</button>

				<Clipboard download={{ package: pack, version: pack.Versions[index] }} />

				<button
					class="px-1 hover:text-primary focus:outline-none"
					use:tippy={{ content: selected ? "Change to this version" : "Add this version" }}
					on:click={() => addToSelected(pack.Versions[index])}
				>
					{#if selected}
						<IconPen width={20} height={20} />
					{:else}
						<IconPlus width={20} height={20} />
					{/if}
				</button>
			</div>
		</div>
	</VirtualList>
</div>

<style>
	.list :global(.virtual-list-wrapper) {
		overflow-x: hidden;
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar-thumb {
		background: #d4d4d4;
		border-radius: 30px;
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar-thumb:hover {
		background: #888888;
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar-track {
		background: #f5f5f5;
		border-radius: 30px;
	}
</style>
