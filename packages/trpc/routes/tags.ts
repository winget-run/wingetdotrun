import { prisma, tagModel } from "@wingetdotrun/prisma";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {
	createCreateInputSchema,
	createCreateOutputSchema,
	createDeleteInputSchema,
	createDeleteOutputSchema,
	createFindInputSchema,
	createFindOutputSchema,
	createListInputSchema,
	createListOutputSchema,
	createUpdateInputSchema,
	createUpdateOutputSchema,
} from "../util";

const findInputSchema = createFindInputSchema();
const listInputSchema = createListInputSchema(z.object({}));
const createInputSchema = createCreateInputSchema(tagModel);
const updateInputSchema = createUpdateInputSchema(tagModel);
const deleteInputSchema = createDeleteInputSchema();

const findOutputSchema = createFindOutputSchema(tagModel);
const listOutputSchema = createListOutputSchema(tagModel);
const createOutputSchema = createCreateOutputSchema(tagModel);
const updateOutputSchema = createUpdateOutputSchema();
const deleteOutputSchema = createDeleteOutputSchema();

export const tagRouter = router({
	find: publicProcedure
		.input(findInputSchema)
		.output(findOutputSchema)
		.query(async ({ input }) => {
			const tag = await prisma.tag.findFirst({ where: { id: input.id } });

			return {
				data: tag,
			};
		}),

	list: publicProcedure
		.input(listInputSchema)
		.output(listOutputSchema)
		.query(async ({ input }) => {
			const [count, tags] = await prisma.$transaction([
				prisma.tag.count(),
				prisma.tag.findMany({
					skip: input.page * input.perPage,
					take: input.perPage,
				}),
			]);

			return {
				data: tags,
				page: input.page,
				total: count,
			};
		}),

	create: publicProcedure
		.input(createInputSchema)
		.output(createOutputSchema)
		.mutation(async ({ input }) => {
			const tag = await prisma.tag.create({ data: input });

			return {
				data: tag,
			};
		}),

	update: publicProcedure
		.input(updateInputSchema)
		.output(updateOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.tag.update({ where: { id: input.id }, data: input.data });

			return {
				updated: 1,
			};
		}),

	delete: publicProcedure
		.input(deleteInputSchema)
		.output(deleteOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.tag.delete({ where: { id: input.id } });

			return {
				deleted: 1,
			};
		}),
});
