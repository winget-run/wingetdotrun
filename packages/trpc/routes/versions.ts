import { prisma, versionModel } from "@wingetdotrun/prisma";
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
const createInputSchema = createCreateInputSchema(versionModel);
const updateInputSchema = createUpdateInputSchema(versionModel);
const deleteInputSchema = createDeleteInputSchema();

const findOutputSchema = createFindOutputSchema(versionModel);
const listOutputSchema = createListOutputSchema(versionModel);
const createOutputSchema = createCreateOutputSchema(versionModel);
const updateOutputSchema = createUpdateOutputSchema();
const deleteOutputSchema = createDeleteOutputSchema();

export const versionRouter = router({
	find: publicProcedure
		.input(findInputSchema)
		.output(findOutputSchema)
		.query(async ({ input }) => {
			const version = await prisma.version.findFirst({ where: { id: input.id } });

			return {
				data: version,
			};
		}),

	list: publicProcedure
		.input(listInputSchema)
		.output(listOutputSchema)
		.query(async ({ input }) => {
			const [count, versions] = await prisma.$transaction([
				prisma.version.count(),
				prisma.version.findMany({
					skip: input.page * input.perPage,
					take: input.perPage,
				}),
			]);

			return {
				data: versions,
				page: input.page,
				total: count,
			};
		}),

	create: publicProcedure
		.input(createInputSchema)
		.output(createOutputSchema)
		.mutation(async ({ input }) => {
			const version = await prisma.version.create({ data: input });

			return {
				data: version,
			};
		}),

	update: publicProcedure
		.input(updateInputSchema)
		.output(updateOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.version.update({ where: { id: input.id }, data: input.data });

			return {
				updated: 1,
			};
		}),

	delete: publicProcedure
		.input(deleteInputSchema)
		.output(deleteOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.version.delete({ where: { id: input.id } });

			return {
				deleted: 1,
			};
		}),
});
