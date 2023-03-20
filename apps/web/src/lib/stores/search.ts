import { writable } from "svelte/store";

export type SearchStoreParams = {
	query?: string;
	results?: any[];
	isSearching?: boolean;
	visible?: boolean;
};

export const search = (() => {
	const { subscribe, set, update } = writable<SearchStoreParams>({});

	const setVisibility = (v: boolean) => update((n) => ({ ...n, visible: v }));

	return { subscribe, set, update, setVisibility };
})();
