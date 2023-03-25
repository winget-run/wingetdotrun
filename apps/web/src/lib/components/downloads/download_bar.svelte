<script lang="ts">
	import { tippy } from "$lib/actions";
	import { clipboard } from "$lib/stores/clipboard";
	import { downloadModalOpen, downloads } from "$lib/stores/downloads";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import { prefersReducedMotion } from "svaria";
	import { flip } from "svelte/animate";
	import { backOut, quadOut } from "svelte/easing";
	import { crossfade, fly } from "svelte/transition";
	import IconClipboard from "~icons/lucide/clipboard";
	import IconChevronUp from "~icons/lucide/chevron-up";
	import IconDownload from "~icons/lucide/download";
	import PackageIcon from "../package/package_icon.svelte";

	const transitionLength = 250;

	const { copyText, message } = clipboard();

	$: [send, recieve] = crossfade({
		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === "none" ? "" : style.transform;

			return {
				duration: transitionLength,
				easing: backOut,
				css: (t, u) =>
					$prefersReducedMotion
						? `opacity: ${t}`
						: `
					transform: ${transform} scale(${1 - 0.2 * u});
					opacity: ${t}
				`,
			};
		},
	});
</script>

{#if $downloads.items.length > 0 && !$downloadModalOpen}
	<div
		transition:fly={{ y: $prefersReducedMotion ? 0 : 20, duration: transitionLength, easing: backOut }}
		class="fixed inset-x-auto bottom-10 z-50 w-full"
	>
		<div class="container mx-auto px-5">
			<div
				class="flex h-[72px] items-center rounded-xl border border-white/10 bg-background/80 px-5 shadow-lg backdrop-blur transition-all gap-8"
			>
				<div class="flex overflow-hidden flex-1 gap-3">
					{#each $downloads.items as download (download.id)}
						<div
							in:recieve={{ key: download.id }}
							out:send={{ key: download.id }}
							animate:flip={{
								duration: $prefersReducedMotion ? 0 : 250,
								easing: quadOut,
								delay: $prefersReducedMotion ? 250 : 0,
							}}
						>
							<div
								use:tippy={{ content: download.name, placement: "top" }}
								class="bg-white shadow w-auto rounded-lg p-1.5"
							>
								<PackageIcon logo={download.logo} homepage={download.homepage} size={32} />
							</div>
						</div>
					{/each}
				</div>
				<div class="flex flex-shrink-0 gap-3">
					<button
						use:tippy={{ content: $message, placement: "top", hideOnClick: false }}
						on:click={() => copyText(mapDownloadsToCommands($downloads.items))}
						class="bg-primary/10 text-primary rounded-lg flex items-center justify-center w-11 h-11"
					>
						<IconClipboard width={24} height={24} />
					</button>
					<button
						use:tippy={{ content: "Download PowerShell script", placement: "top" }}
						class="bg-primary/10 text-primary rounded-lg flex items-center justify-center w-11 h-11"
					>
						<IconDownload width={24} height={24} />
					</button>
					<button
						id="download-modal-trigger"
						use:tippy={{ content: "More download options", placement: "top", hideOnClick: false }}
						on:click={() => downloadModalOpen.set(true)}
						class="bg-primary/10 text-primary rounded-lg flex items-center justify-center w-11 h-11"
					>
						<IconChevronUp width={24} height={24} />
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
