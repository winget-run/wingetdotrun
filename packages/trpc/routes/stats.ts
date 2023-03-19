import { prisma, statModel } from "@wingetdotrun/prisma";
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
const createInputSchema = createCreateInputSchema(statModel);
const updateInputSchema = createUpdateInputSchema(statModel);
const deleteInputSchema = createDeleteInputSchema();

const findOutputSchema = createFindOutputSchema(statModel);
const listOutputSchema = createListOutputSchema(statModel);
const createOutputSchema = createCreateOutputSchema(statModel);
const updateOutputSchema = createUpdateOutputSchema();
const deleteOutputSchema = createDeleteOutputSchema();

export const statRouter = router({
	find: publicProcedure
		.input(findInputSchema)
		.output(findOutputSchema)
		.query(async ({ input }) => {
			const stat = await prisma.stat.findFirst({ where: { id: input.id } });

			return {
				data: stat,
			};
		}),

	list: publicProcedure
		.input(listInputSchema)
		.output(listOutputSchema)
		.query(async ({ input }) => {
			const [count, stats] = await prisma.$transaction([
				prisma.stat.count(),
				prisma.stat.findMany({
					skip: input.page * input.perPage,
					take: input.perPage,
				}),
			]);

			return {
				data: stats,
				page: input.page,
				total: count,
			};
		}),

	create: publicProcedure
		.input(createInputSchema)
		.output(createOutputSchema)
		.mutation(async ({ input }) => {
			const stat = await prisma.stat.create({ data: input });

			return {
				data: stat,
			};
		}),

	update: publicProcedure
		.input(updateInputSchema)
		.output(updateOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.stat.update({ where: { id: input.id }, data: input.data });

			return {
				updated: 1,
			};
		}),

	delete: publicProcedure
		.input(deleteInputSchema)
		.output(deleteOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.stat.delete({ where: { id: input.id } });

			return {
				deleted: 1,
			};
		}),
});
