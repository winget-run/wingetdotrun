import type { packageSchema } from "$lib/db/types";
import { Client as TypesenseClient } from "typesense";
import z from "zod";
import { PACKAGE_COLLECTION_NAME } from "./schema";
import { searchSchema } from "./types";

type Client = TypesenseClient;

const PACKAGE_SEARCH_PERPAGE = 5;

export class PackageSearchHelpers {
	#client: Client;

	constructor(client: Client) {
		this.#client = client;
	}

	async searchPackages(query: string) {
		const results = await this.#client
			.collections(PACKAGE_COLLECTION_NAME)
			.documents()
			.search({
				q: query,
				query_by: ["name", "tags", "shortDescription", "embedding"],
				exclude_fields: ["embedding"],
				per_page: PACKAGE_SEARCH_PERPAGE,
			});

		const parsed = searchSchema.safeParse(results.hits);

		if (!parsed.success) {
			throw new Error(`failed to parse search response for query '${query}'`, { cause: parsed.error });
		}

		return parsed.data;
	}

	async getAllPackageIndexIdents() {
		return this.#client
			.collections(PACKAGE_COLLECTION_NAME)
			.documents()
			.search({ q: "*", include_fields: "id" })
			.then((e) => e.hits?.map((e) => z.object({ id: z.string() }).parse(e.document).id) ?? []);
	}

	async upsertPackageIndex<T extends z.infer<typeof packageSchema>>(pkg: T) {
		const { ident: id, name, shortDescription, tags } = pkg;

		await this.#client
			.collections(PACKAGE_COLLECTION_NAME)
			.documents()
			.upsert({ id, name, shortDescription, tags: tags ?? [] });
	}

	async deletePackageIndex<T extends z.infer<typeof packageSchema>>(ident: T["ident"]) {
		return this.#client.collections(PACKAGE_COLLECTION_NAME).documents(ident).delete();
	}
}
