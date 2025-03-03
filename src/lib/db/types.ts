import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import * as schema from "./schema";

export type Package = z.infer<typeof packageSchema>;
export type Publisher = z.infer<typeof publisherSchema>;
export type Version = z.infer<typeof versionSchema>;

// drizzle-zod doesnt type json fields in a way thats compatible with drizzle
export const packageSchema = createInsertSchema(schema.packages, {
	tags: z.array(z.string()).nullish(),
});

export const publisherSchema = createInsertSchema(schema.publishers, {
	aliases: z.array(z.string()),
});

export const versionSchema = createInsertSchema(schema.versions);
