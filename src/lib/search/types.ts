import { z } from "zod";

export const searchSchema = z.array(
	z
		.object({
			document: z.object({
				id: z.string(),
				name: z.string(),
				tags: z.array(z.string()),
				shortDescription: z.string(),
			}),
		})
		.transform((search) => ({
			ident: search.document.id,
			name: search.document.name,
			tags: search.document.tags,
			shortDescription: search.document.shortDescription,
		})),
);
