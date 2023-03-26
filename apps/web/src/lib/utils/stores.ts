import { browser } from "$app/environment";
import { get, writable, type Writable } from "svelte/store";
import type { z, ZodSchema } from "zod";

export function sessionStorable<T extends ZodSchema>(
	key: string,
	schema: T,
	initialData?: z.infer<T>,
): Writable<z.infer<T>> {
	const store = writable(initialData);
	const { subscribe, set } = store;

	if (browser) {
		const stored = schema.safeParse(sessionStorage.getItem(key));
		if (stored.success) set(stored.data);
	}

	return {
		subscribe,
		set: (v) => {
			if (browser) localStorage.setItem(key, JSON.stringify(v));
			set(v);
		},
		update: (cb) => {
			const updatedStore = cb(get(store));
			if (browser) localStorage.setItem(key, JSON.stringify(updatedStore));
			set(updatedStore);
		},
	};
}
