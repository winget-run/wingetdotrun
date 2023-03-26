import { browser } from "$app/environment";
import type { DownloadFormat } from "$lib/utils/downloads";
import { sessionStorable } from "$lib/utils/stores";
import { get, writable } from "svelte/store";
import { z } from "zod";

export const downloadSchema = z.object({
	id: z.string(),
	name: z.string(),
	version: z.string().optional(),
	logo: z.string().url().nullable().optional(),
	homepage: z.string().url().nullable().optional(),
});

export type Download = z.infer<typeof downloadSchema>;

export const downloadOptionsSchema = z.object({
	scope: z.enum(["user", "machine"]).optional(),
	installation: z.enum(["silent", "interactive"]).optional(),
	acceptPackageAgreements: z.boolean().optional(),
	acceptSourceAgreements: z.boolean().optional(),
});
export type DownloadOptions = z.infer<typeof downloadOptionsSchema>;

export const downloadStoreSchema = z.object({
	items: z.array(downloadSchema),
	options: downloadOptionsSchema,
	format: z.enum(["ps1", "bat", "json"]).optional(),
});
export type DownloadStoreParams = z.infer<typeof downloadStoreSchema>;

export const downloads = (() => {
	const { subscribe, set, update } = sessionStorable("downloads", downloadStoreSchema, {
		items: [],
		options: {
			scope: undefined,
			installation: undefined,
			acceptPackageAgreements: undefined,
			acceptSourceAgreements: undefined,
		},
		format: "ps1",
	});

	// Downloads
	const add = (d: Download) => update((n) => ({ ...n, items: [...n.items, d] }));
	const changeVersion = (id: string, version: string) =>
		update((n) => ({ ...n, items: n.items.map((d) => (d.id === id ? { ...d, version } : d)) }));
	const remove = (id: string) => update((n) => ({ ...n, items: n.items.filter((d) => d.id !== id) }));
	const clear = () => update((n) => ({ ...n, items: [] }));

	return { subscribe, set, update, add, changeVersion, remove, clear };
})();

export const downloadModalOpen = writable(false);
