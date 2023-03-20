<script lang="ts">
	import clsx from "clsx";

	export let href = "";
	export let size: "sm" | "md" | "lg" = "md";
	export let outlined = false;

	let baseButtonClasses =
		"inline-flex items-center justify-center gap-2 rounded-lg border focus:outline-none transition transform font-semibold truncate";

	$: themeClasses = outlined
		? "border-primary text-primary hover:(text-primary-60 border-primary-60 bg-primary-20) focus-visible:(text-primary-60 border-primary-60 bg-primary-20)"
		: "bg-primary text-background border-transparent shadow shadow-primary hover:bg-opacity-80 focus-visible:ring ring-primary focus-visible:bg-opacity-0";

	$: sizeClasses = size === "sm" ? "py-2.5 px-4 text-sm" : size === "lg" ? "py-3 px-5 text-lg" : "py-3 px-5";

	$: iconSize = size === "sm" ? "1rem" : size === "lg" ? "1.5rem" : "1.25rem";

	$: finalClasses = clsx(baseButtonClasses, themeClasses, sizeClasses, $$props.class);
</script>

{#if href}
	<a {...$$restProps} on:click class={finalClasses} {href}><slot {iconSize} /></a>
{:else}
	<button {...$$restProps} on:click class={finalClasses}><slot {iconSize} /></button>
{/if}
