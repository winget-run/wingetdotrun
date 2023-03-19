import { derived, writable } from "svelte/store";

export const clipboard = (duration = 2000) => {
	let timeout: any;
	const messages = {
		initial: "Copy to clipboard",
		copied: "Copied to clipboard!",
		error: "Failed to copy",
	};
	const copied = writable<boolean | null>(null, () => clearTimeout(timeout));

	const message = derived(copied, ($copied) => {
		switch ($copied) {
			case true:
				return messages.copied;
			case false:
				return messages.error;
			default:
				return messages.initial;
		}
	});

	const copyText = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			copied.set(true);
		} catch (err) {
			console.error("Failed to copy: ", err);
			copied.set(false);
		} finally {
			timeout = setTimeout(() => {
				copied.set(null);
			}, duration);
		}
	};

	return { message, copied: { subscribe: copied.subscribe }, copyText };
};
