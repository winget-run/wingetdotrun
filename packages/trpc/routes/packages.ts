import { prisma, packageModel } from "@wingetdotrun/prisma";
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
const createInputSchema = createCreateInputSchema(packageModel);
const updateInputSchema = createUpdateInputSchema(packageModel);
const deleteInputSchema = createDeleteInputSchema();

const findOutputSchema = createFindOutputSchema(packageModel);
const listOutputSchema = createListOutputSchema(packageModel);
const createOutputSchema = createCreateOutputSchema(packageModel);
const updateOutputSchema = createUpdateOutputSchema();
const deleteOutputSchema = createDeleteOutputSchema();

export const packageRouter = router({
	find: publicProcedure
		.input(findInputSchema)
		.output(findOutputSchema)
		.query(async ({ input }) => {
			const pkg = await prisma.package.findFirst({ where: { id: input.id } });

			return {
				data: pkg,
			};
		}),

	list: publicProcedure
		.input(listInputSchema)
		.output(listOutputSchema)
		.query(async ({ input }) => {
			const [count, packages] = await prisma.$transaction([
				prisma.package.count(),
				prisma.package.findMany({
					skip: input.page * input.perPage,
					take: input.perPage,
				}),
			]);

			return {
				data: packages,
				page: input.page,
				total: count,
			};
		}),

	create: publicProcedure
		.input(createInputSchema)
		.output(createOutputSchema)
		.mutation(async ({ input }) => {
			const pkg = await prisma.package.create({ data: input });

			return {
				data: pkg,
			};
		}),

	update: publicProcedure
		.input(updateInputSchema)
		.output(updateOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.package.update({ where: { id: input.id }, data: input.data });

			return {
				updated: 1,
			};
		}),

	delete: publicProcedure
		.input(deleteInputSchema)
		.output(deleteOutputSchema)
		.mutation(async ({ input }) => {
			await prisma.package.delete({ where: { id: input.id } });

			return {
				deleted: 1,
			};
		}),
});
