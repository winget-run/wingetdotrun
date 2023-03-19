<script lang="ts">
	import { tippy } from "$lib/actions";
	import { clipboard } from "$lib/stores/clipboard";
	import type { IDownload } from "$lib/stores/packages";
	import { mapDownloadsToCommands } from "$lib/utils/downloads";
	import IconClipboard from "~icons/uil/clipboard-notes";

	export let download: IDownload;

	let { message, copyText } = clipboard();
</script>

<button
	use:tippy={{ content: $message }}
	on:click={() => copyText(mapDownloadsToCommands([download], null))}
	class="px-1 hover:text-primary focus:outline-none"
>
	<IconClipboard width={20} height={20} />
</button>
