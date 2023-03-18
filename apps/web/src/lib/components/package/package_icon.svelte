<script lang="ts">
	import IconPackage from "~icons/lucide/package";
	import Github from "../svg/github.svelte";

	export let homepage: string | undefined;
	export let logo: string | undefined;
	export let custom: { icon: any; class: string | undefined } = {
		icon: undefined,
		class: undefined,
	};
	export let size = 32;

	$: {
		if (homepage?.includes("github.com")) {
			custom = {
				icon: Github,
				class: "text-white",
			};
		}
	}
</script>

{#if custom.icon}
	<svelte:component this={custom.icon} class={custom.class} width={size} height={size} />
{:else if logo || homepage}
	<img
		src={logo || `https://www.google.com/s2/favicons?sz=${size}&domain_url=${homepage}`}
		alt=""
		width={size}
		height={size}
		class={$$props.class}
		style="height: {size / 16}rem; width: {size / 16}rem"
	/>
{:else}
	<IconPackage class="text-primary" width={size} height={size} />
{/if}
