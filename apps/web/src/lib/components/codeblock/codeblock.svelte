<script lang="ts">
	import { tippy } from "$lib/actions";
	import { clipboard } from "$lib/stores/clipboard";
	import clsx from "clsx";
	import IconClipboard from "~icons/lucide/clipboard";

	export let code: string;
	export let multiline = false;
	export let hideCopyButton = false;

	let { message, copyText, copied } = clipboard();
</script>

<code
	class={clsx(
		"relative flex max-w-full gap-4 rounded-lg border border-white/10 bg-card-hover bg-opacity-50 p-5 text-left backdrop-blur @container",
		multiline ? "items-end" : "h-14 items-center leading-normal",
		$$props.class,
	)}
>
	<div
		class={clsx(
			"w-0 flex-1 before:mr-3 before:text-primary before:content-['>'] @xl:text-lg",
			multiline ? "line-clamp-7 overflow-elipsis h-48" : "truncate",
		)}
	>
		{code}
	</div>
	{#if !hideCopyButton}
		<button
			use:tippy={{ content: $message, hideOnClick: false, delay: $copied ? 1500 : 0 }}
			on:click={() => copyText(code)}
			class="flex-shrink-0 text-current hover:text-primary focus:outline-none"
		>
			<IconClipboard width={22} height={22} />
		</button>
	{/if}
</code>
