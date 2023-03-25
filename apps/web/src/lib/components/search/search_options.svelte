<script lang="ts">
	import clsx from "clsx";
	import { prefersReducedMotion } from "svaria";
	import { backOut } from "svelte/easing";
	import { fly } from "svelte/transition";

	export let delay = 0;
</script>

<div
	in:fly={{
		y: $prefersReducedMotion ? 0 : 10,
		easing: backOut,
		delay,
	}}
	out:fly={{
		y: $prefersReducedMotion ? 0 : 10,
		easing: backOut,
		delay,
	}}
	class={clsx(
		"bg-card bg-opacity-80 backdrop-filter backdrop-blur border border-white/10 rounded-lg h-full w-full p-6",
		$$props.class,
	)}
>
	<h2 class="font-semibold text-lg text-primary mb-2">Advanced search options</h2>
	<table class="text-body">
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title"> name:</td>
			<td class="pb-2 align-top"> Searches only the package names. </td>
		</tr>
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title">publisher:</td>
			<td class="pb-2 align-top"> Searches for packages by a publisher. </td>
		</tr>
		<tr>
			<td class="pr-3 pb-2 align-top font-mono font-semibold text-title"> description: </td>
			<td class="pb-2 align-top"> Searches only for keywords in the description. </td>
		</tr>
		<tr>
			<td class="pr-3 align-top font-mono font-semibold text-title"> tags: </td>
			<td class="align-top"> Searches for packages with a specific tag </td>
		</tr>
	</table>
</div>
