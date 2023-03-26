<script lang="ts">
	import { tippy } from "$lib/actions";
	import { clipboard } from "$lib/stores/clipboard";
	import { downloadModalOpen, downloads, type DownloadOptions } from "$lib/stores/downloads";
	import { DOWNLOAD_FORMATS, mapDownloadsToCommands, type DownloadFormat } from "$lib/utils/downloads";
	import { Modal, prefersReducedMotion } from "svaria";
	import { flip } from "svelte/animate";
	import { backOut, quadOut } from "svelte/easing";
	import { crossfade, fade, fly } from "svelte/transition";
	import IconClipboard from "~icons/lucide/clipboard";
	import IconDownload from "~icons/lucide/download";
	import IconListClear from "~icons/lucide/list-x";
	import Button from "../button/button.svelte";
	import Codeblock from "../codeblock/codeblock.svelte";
	import PackageIcon from "../package/package_icon.svelte";

	const transitionLength = 250;

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

	const { copyText, message } = clipboard();

	function toggleFormat(format: DownloadFormat) {
		downloads.update((x) => {
			format !== "ps1" ? (x.format = format) : (x.format = "ps1");
			return x;
		});
	}

	function toggleScope(scope: DownloadOptions["scope"]) {
		if ($downloads.options.scope === scope) {
			downloads.update((x) => {
				x.options.scope = undefined;
				return x;
			});
		} else {
			downloads.update((x) => {
				x.options.scope = scope;
				return x;
			});
		}
	}

	function toggleInstallationType(type: DownloadOptions["installation"]) {
		if ($downloads.options.installation === type) {
			downloads.update((x) => {
				x.options.installation = undefined;
				return x;
			});
		} else {
			downloads.update((x) => {
				x.options.installation = type;
				return x;
			});
		}
	}
</script>

{#if $downloadModalOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		transition:fade={{ duration: transitionLength }}
		class="fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-background/50 px-4 backdrop-blur-sm"
	>
		<div
			class="w-full max-w-7xl p-5 max-h-full"
			transition:fly={{ duration: transitionLength, y: $prefersReducedMotion ? 0 : 20 }}
		>
			<Modal
				id="download-modal"
				labelId="download-modal-title"
				descriptionId="download-modal-description"
				focusOnOpenId="download-modal-list"
				focusOnCloseId="main"
				class="flex w-full max-h-full h-full min-h-[75vh] overflow-hidden rounded-xl border border-white/10 shadow-2xl"
				on:close={() => downloadModalOpen.set(false)}
			>
				<!-- Screenreader -->
				<div class="sr-only">
					<h2 id="download-modal-title">Downloads</h2>
					<p id="download-modal-description">A list of all downloads</p>
				</div>

				<!-- List -->
				<div id="download-modal-list" class="flex-1 bg-card/20 p-8 backdrop-blur">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-xl font-bold text-title">
							{$downloads.items.length} Package{$downloads.items.length === 1 ? "" : "s"}
						</h3>

						<button
							use:tippy={{ content: "Clear all selected packages" }}
							on:click={downloads.clear}
							class="flex h-11 w-11 items-center justify-center rounded-lg text-title hover:bg-primary/10 hover:text-primary"
						>
							<IconListClear width={24} height={24} />
						</button>
					</div>

					<div class="flex flex-col gap-2 h-full">
						{#each $downloads.items as item (item.id)}
							<div
								in:recieve|local={{ key: item.id }}
								out:send|local={{ key: item.id }}
								animate:flip={{
									duration: $prefersReducedMotion ? 0 : 250,
									easing: quadOut,
									delay: $prefersReducedMotion ? 250 : 0,
								}}
							>
								<div class="flex h-full w-full flex-col gap-2 rounded-lg border border-white/10 bg-card p-4">
									<div class="flex items-center gap-2.5">
										<PackageIcon logo={item.logo} homepage={item.homepage} size={24} />
										<h4 class="break-all font-semibold leading-tight text-title line-clamp-1">{item.name}</h4>
									</div>
									<div class="flex items-center gap-2.5">
										<p class="flex-1">{item.version ?? "Latest"}</p>
										<button on:click={() => downloads.remove(item.id)}>Remove</button>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Options -->
				<div class="flex flex-1 flex-col gap-5 bg-card p-8">
					<div class="flex gap-4">
						{#each DOWNLOAD_FORMATS as format}
							<Button
								class="flex-1"
								size="sm"
								outlined={$downloads.format !== format}
								on:click={() => toggleFormat(format)}
							>
								.{format}
							</Button>
						{/each}
					</div>

					<Codeblock
						multiline
						hideCopyButton
						code={mapDownloadsToCommands($downloads.items, $downloads.options, $downloads.format)}
					/>

					<div class="flex gap-4">
						<div class="flex-1">
							<h3 class="mb-2 text-lg font-bold text-title">Installation Scope</h3>

							<div class="flex gap-3">
								<Button outlined={$downloads.options.scope !== "user"} on:click={() => toggleScope("user")}>User</Button
								>
								<Button outlined={$downloads.options.scope !== "machine"} on:click={() => toggleScope("machine")}>
									Machine
								</Button>
							</div>
						</div>

						<div class="flex-1">
							<h3 class="mb-2 text-lg font-bold text-title">Installation Type</h3>

							<div class="flex gap-3">
								<Button
									outlined={$downloads.options.installation !== "silent"}
									on:click={() => toggleInstallationType("silent")}
								>
									Silent
								</Button>
								<Button
									outlined={$downloads.options.installation !== "interactive"}
									on:click={() => toggleInstallationType("interactive")}
								>
									Interactive
								</Button>
							</div>
						</div>
					</div>

					<div class="flex gap-4 mt-auto">
						<Button
							class="flex-1"
							size="sm"
							on:click={() => copyText(mapDownloadsToCommands($downloads.items, $downloads.options, $downloads.format))}
						>
							<IconClipboard width={24} height={24} />
							{$message}
						</Button>
						<Button class="flex-1" size="sm">
							<IconDownload width={24} height={24} />
							Download as .{$downloads.format}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	</div>
{/if}
