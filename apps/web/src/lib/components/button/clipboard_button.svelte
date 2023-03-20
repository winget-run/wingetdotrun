<script lang="ts">
	import { tippy } from "$lib/actions";
	import { clipboard } from "$lib/stores/clipboard";
	import type { Download } from "$lib/stores/downloads";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import IconClipboard from "~icons/lucide/clipboard";

	export let download: Download;

	let { message, copyText } = clipboard();
</script>

<button
	use:tippy={{ content: $message, hideOnClick: false }}
	on:click={() => copyText(mapDownloadsToCommands([download]))}
	class="px-1 hover:text-primary focus:outline-none"
>
	<IconClipboard width={20} height={20} />
</button>
