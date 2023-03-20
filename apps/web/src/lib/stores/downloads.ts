import { writable } from "svelte/store";

export type Download = {
	id: string;
	name: string;
	version: string;
};

export type DownloadOptions = {
	scope?: "user" | "machine";
	installation?: "silent" | "interactive";
	acceptPackageAgreements?: boolean;
	acceptSourceAgreements?: boolean;
};

export type DownloadStoreParams = {
	items: Download[];
	options: DownloadOptions;
};

export const downloads = (() => {
	const { subscribe, set, update } = writable<DownloadStoreParams>({
		items: [],
		options: {
			scope: undefined,
			installation: undefined,
			acceptPackageAgreements: undefined,
			acceptSourceAgreements: undefined,
		},
	});

	// Downloads
	const add = (d: Download) => update((n) => ({ ...n, items: [...n.items, d] }));
	const changeVersion = (id: string, version: string) =>
		update((n) => ({ ...n, items: n.items.map((d) => (d.id === id ? { ...d, version } : d)) }));
	const remove = (id: string) => update((n) => ({ ...n, items: n.items.filter((d) => d.id !== id) }));
	const clear = () => update((n) => ({ ...n, items: [] }));

	return { subscribe, set, update, add, changeVersion, remove, clear };
})();
