/**
 * Store associations between keys.
 */
export class ClusterMap<K> {
	private map = new Map<K, K[]>();

	constructor() {}

	/**
	 * Get all the associations for a given key.
	 */
	get(k: K): K[] | null {
		return this.map.get(k) ?? null;
	}

	/**
	 * Create an association between two keys. This is irreversible.
	 */
	add(a: K, b: K) {
		const ac = this.get(a);
		const bc = this.get(b);

		// create new cluster
		if (ac == null && bc == null) {
			if (a === b) {
				const cluster = [a];

				this.map.set(a, cluster);
			} else {
				const cluster = [a, b];

				this.map.set(a, cluster);
				this.map.set(b, cluster);
			}
		}

		// add to existing cluster
		if (ac == null && bc != null) {
			bc.push(a);

			this.map.set(a, bc);
		}

		if (ac != null && bc == null) {
			ac.push(b);

			this.map.set(b, ac);
		}

		// join clusters
		if (ac != null && bc != null) {
			// already associated
			if (ac.every((e) => bc.includes(e))) {
				return;
			}

			// not already associated
			const cluster = [...ac, ...bc];

			for (const k of cluster) {
				this.map.set(k, cluster);
			}
		}
	}
}
