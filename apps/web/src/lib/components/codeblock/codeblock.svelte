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
		"relative bg-card bg-opacity-50 backdrop-blur border border-white border-opacity-10 rounded-lg p-4 flex",
		multiline ? "items-end" : "items-center leading-normal",
		$$props.class,
	)}
>
	<span
		class={clsx(
			"content before:content-['>'] before:mr-2 before:text-primary flex-1",
			multiline ? "h-48 line-clamp-7 overflow-elipsis" : "truncate",
		)}
	>
		{code}
	</span>
	<button
		use:tippy={{ content: $message, hideOnClick: false, delay: $copied ? 1500 : 0 }}
		on:click={() => copyText(code)}
		class="text-current focus:outline-none hover:text-primary"
	>
		<IconClipboard width={22} height={22} />
	</button>
</code>
