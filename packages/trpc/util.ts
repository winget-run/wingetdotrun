import { z } from "zod";

// consts
const DEFAULT_PAGE = 0;
const MIN_PAGE = 0;

const DEFAULT_PER_PAGE = 12;
const MIN_PER_PAGE = 1;
const MAX_PER_PAGE = 50;

// helpers
export const createGenericListFilters = <F extends z.AnyZodObject>(filters: F) => {
	return z
		.object({
			page: z.number().min(MIN_PAGE).optional().default(DEFAULT_PAGE),
			perPage: z.number().min(MIN_PER_PAGE).max(MAX_PER_PAGE).optional().default(DEFAULT_PER_PAGE),
		})
		.merge(filters);
};

export const createGenericOutputSchema = <D extends z.ZodTypeAny, M extends z.AnyZodObject>(data: D, meta: M) => {
	return z.object({ data }).merge(meta);
};

// inputs
export const createFindInputSchema = () => {
	return z.object({ id: z.string().uuid() });
};

export const createListInputSchema = <F extends z.AnyZodObject>(filters: F) => {
	return createGenericListFilters(filters);
};

export const createCreateInputSchema = <D extends z.AnyZodObject>(data: D) => {
	return data;
};

export const createUpdateInputSchema = <D extends z.AnyZodObject>(data: D) => {
	return z.object({ id: z.string().uuid(), data: data.partial() });
};

export const createDeleteInputSchema = () => {
	return z.object({ id: z.string().uuid() });
};

// outputs
export const createFindOutputSchema = <D extends z.AnyZodObject>(data: D) => {
	return createGenericOutputSchema(data.nullable(), z.object({}));
};

export const createListOutputSchema = <D extends z.AnyZodObject>(data: D) => {
	return createGenericOutputSchema(z.array(data), z.object({ page: z.number().gte(0), total: z.number().gte(0) }));
};

export const createCreateOutputSchema = <D extends z.AnyZodObject>(data: D) => {
	return createGenericOutputSchema(data, z.object({}));
};

export const createUpdateOutputSchema = () => {
	return createGenericOutputSchema(z.undefined(), z.object({ updated: z.number() }));
};

export const createDeleteOutputSchema = () => {
	return createGenericOutputSchema(z.undefined(), z.object({ deleted: z.number() }));
};
