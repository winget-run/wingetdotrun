<script lang="ts">
	import { tippy } from "$lib/actions";
	import { clipboard } from "$lib/stores/clipboard";
	import clsx from "clsx";
	import IconClipboard from "~icons/lucide/clipboard";

	export let code: string;
	export let multiline = false;

	let { message, copyText, copied } = clipboard();
</script>

<code
	class={clsx(
		"relative flex max-w-full rounded-lg border border-white/10 bg-card-hover bg-opacity-50 p-5 backdrop-blur gap-4 @container",
		multiline ? "items-end" : "items-center leading-normal h-14",
		$$props.class,
	)}
>
	<div
		class={clsx(
			"@xl:text-lg before:mr-3 before:text-primary before:content-['>'] flex-1 w-0",
			multiline ? "line-clamp-7 overflow-elipsis h-48" : "truncate",
		)}
	>
		{code}
	</div>
	<button
		use:tippy={{ content: $message, hideOnClick: false, delay: $copied ? 1500 : 0 }}
		on:click={() => copyText(code)}
		class="text-current hover:text-primary focus:outline-none flex-shrink-0"
	>
		<IconClipboard width={22} height={22} />
	</button>
</code>
