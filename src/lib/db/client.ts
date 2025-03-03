import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const createDatabaseClient = (options: { url: string; authToken?: string }) => {
	const sqlite = createClient(options);

	const client = drizzle(sqlite, {
		schema,
	});

	return client;
};
