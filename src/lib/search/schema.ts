import type { Client } from "typesense";

export const PACKAGE_COLLECTION_NAME = "packages";

export const createPackageCollection = async (client: Client) =>
	client.collections().create({
		name: PACKAGE_COLLECTION_NAME,
		fields: [
			{
				name: "id",
				type: "string",
			},
			{
				name: "name",
				type: "string",
			},
			{
				name: "tags",
				type: "string[]",
			},
			{
				name: "shortDescription",
				type: "string",
			},
			{
				name: "embedding",
				type: "float[]",
				embed: {
					from: ["name", "tags", "shortDescription"],
					model_config: {
						model_name: "ts/all-MiniLM-L12-v2",
					},
				},
			},
		],
	});
