<script lang="ts">
	import { tippy } from "$lib/actions";
	import { downloads } from "$lib/stores/downloads";
	import VirtualList from "svelte-tiny-virtual-list";
	import IconPackage from "~icons/lucide/package";
	import IconPen from "~icons/lucide/edit-2";
	import IconPlus from "~icons/lucide/plus";
	import ClipboardButton from "../button/clipboard_button.svelte";

	export let pack: {
		id: string;
		name: string;
		versions: string[];
	};
	$: selected = $downloads.items.find((x) => x.id === pack.id);

	$: [publisher, ...name] = pack.id.split(".");

	function addToSelected(version: string) {
		if (selected) {
			downloads.changeVersion(pack.id, version);
		} else {
			downloads.add({ id: pack.id, name: pack.name, version });
		}
	}
</script>

<div class="list {$$props.class}">
	<VirtualList
		width="100%"
		height={Math.min(32 * 6, Math.max(2, pack.versions.length) * 32)}
		itemCount={pack.versions.length}
		itemSize={32}
	>
		<div
			role="listitem"
			slot="item"
			let:index
			let:style
			class="flex items-center justify-between rounded px-2.5 py-1 pr-1.5 text-body hover:bg-card-hover"
			{style}
		>
			{@const version = pack.versions[index]}
			<p class="truncate text-sm" class:text-primary={selected?.version === version}>{pack.versions[index]}</p>
			<div class="flex items-center">
				<a
					href="https://github.com/microsoft/winget-pkgs/tree/master/manifests/{publisher.at(0)}/{publisher}/{name.join(
						'',
					)}/{version}"
					class="h-full px-1 hover:text-primary focus:outline-none"
					use:tippy={{ content: "Package Manifest" }}
				>
					<IconPackage width={20} height={20} />
				</a>

				<ClipboardButton download={{ ...pack, version }} />

				<button
					class="px-1 hover:text-primary focus:outline-none"
					use:tippy={{ content: selected ? "Change to this version" : "Add this version" }}
					on:click={() => addToSelected(version)}
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
		scrollbar-color: theme("colors.card-hover") theme("colors.card");
		scrollbar-width: thin;
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar-thumb {
		background: theme("colors.card-hover");
		border-radius: 30px;
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar-thumb:hover {
		background: theme("colors.card-hover");
	}
	.list :global(.virtual-list-wrapper)::-webkit-scrollbar-track {
		background: theme("colors.card");
		border-radius: 30px;
	}
</style>
