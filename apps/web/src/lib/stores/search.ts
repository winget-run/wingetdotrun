import { writable } from "svelte/store";

export type ToastType = {
	query?: string;
	results?: any[];
	isSearching?: boolean;
	visible?: boolean;
};

export const search = (() => {
	const { subscribe, set, update } = writable<ToastType>({});

	const setVisibility = (v: boolean) => update((n) => ({ ...n, visible: v }));

	return { subscribe, setVisibility };
})();
