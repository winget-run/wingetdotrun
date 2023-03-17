import { prisma, publisherModel } from "@wingetdotrun/prisma";
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
const createInputSchema = createCreateInputSchema(publisherModel);
const updateInputSchema = createUpdateInputSchema(publisherModel);
const deleteInputSchema = createDeleteInputSchema();

const findOutputSchema = createFindOutputSchema(publisherModel);
const listOutputSchema = createListOutputSchema(publisherModel);
const createOutputSchema = createCreateOutputSchema(publisherModel);
const updateOutputSchema = createUpdateOutputSchema();
const deleteOutputSchema = createDeleteOutputSchema();

export const publisherRouter = router({
	find: publicProcedure
		.input(findInputSchema)
		.output(findOutputSchema)
		.query(async ({ input }) => {
			const publisher = await prisma.publisher.findFirst({ where: { id: input.id } });

			return {
				data: publisher,
			};
		}),

	list: publicProcedure
		.input(listInputSchema)
		.output(listOutputSchema)
		.query(async ({ input }) => {
			const [count, publishers] = await prisma.$transaction([
				prisma.publisher.count(),
				prisma.publisher.findMany({
					skip: input.page * input.perPage,
					take: input.perPage,
				}),
			]);

			return {
				data: publishers,
				page: input.page,
				total: count,
			};
		}),

	create: publicProcedure
		.input(createInputSchema)
		.output(createOutputSchema)
		.mutation(async ({ input }) => {
			const publisher = await prisma.publisher.create({ data: input });

			return {
				data: publisher,
			};
		}),

	update: publicProcedure
		.input(updateInputSchema)
		.output(updateOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.publisher.update({ where: { id: input.id }, data: input.data });

			return {
				updated: 1,
			};
		}),

	delete: publicProcedure
		.input(deleteInputSchema)
		.output(deleteOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.publisher.delete({ where: { id: input.id } });

			return {
				deleted: 1,
			};
		}),
});
