import { logger } from "$lib/util";
import { Client } from "typesense";
import { ObjectNotFound } from "typesense/lib/Typesense/Errors";
import { createPackageCollection, PACKAGE_COLLECTION_NAME } from "./schema";

export const createSearchClient = async (options: { url: string; apiKey: string }) => {
	const client = new Client({
		nodes: [
			{
				url: options.url,
			},
		],
		apiKey: options.apiKey,
	});

	await client
		.collections(PACKAGE_COLLECTION_NAME)
		.retrieve()
		.catch(async (error) => {
			if (error instanceof ObjectNotFound) {
				logger.warn(`collection not found '${PACKAGE_COLLECTION_NAME}'`);

				logger.info(`creating collection '${PACKAGE_COLLECTION_NAME}'`);

				await createPackageCollection(client);

				logger.info(`created collection '${PACKAGE_COLLECTION_NAME}'`);
			}
		});

	return client;
};
