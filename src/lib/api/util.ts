import { env } from "$env/dynamic/private";
import { DATABASE_URL, SEARCH_TOKEN, SEARCH_URL } from "$env/static/private";
import { createDatabaseClient } from "$lib/db/client";
import { PackageDatabaseHelpers } from "$lib/db/helpers";
import { createSearchClient } from "$lib/search/client";
import { PackageSearchHelpers } from "$lib/search/helpers";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import z from "zod";

export const databaseClient = createDatabaseClient({ url: DATABASE_URL, authToken: env.DATABASE_TOKEN });
export const databaseHelpers = new PackageDatabaseHelpers(databaseClient);

export const searchClient = await createSearchClient({ url: SEARCH_URL, apiKey: SEARCH_TOKEN });
export const searchHelpers = new PackageSearchHelpers(searchClient);

export const IdStringParamsSchema = z.object({
	id: z.coerce.string().openapi({
		param: {
			name: "id",
			in: "path",
			required: true,
		},
		required: ["id"],
		example: "vim.vim",
	}),
});

export const QueryStringParamsSchema = z.object({
	query: z.coerce.string().openapi({
		param: {
			name: "query",
			required: true,
		},
		required: ["query"],
		example: "vscode",
	}),
});

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
