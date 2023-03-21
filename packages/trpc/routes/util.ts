import { packageModel, prisma } from "@wingetdotrun/prisma";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {
	createListInputSchema,
	createListOutputSchema,
	createGenericOutputSchema,
	createFindOutputSchema,
	createFindInputSchema,
} from "../util";

const viewsSchema = z.array(
	z.object({
		date: z.date(),
		views: z.number(),
	}),
);

const searchInputSchema = createListInputSchema(z.object({}));
const featuredInputSchema = z.object({});
const packageInputSchema = createFindInputSchema();

const searchOutputSchema = createListOutputSchema(packageModel);
const featuredOutputSchema = createGenericOutputSchema(
	z.array(packageModel.merge(z.object({ publisher: z.string() }))),
	z.object({}),
);
const packageOutputSchema = createFindOutputSchema(
	packageModel.merge(
		z.object({
			publisher: z.string(),
			versions: z.array(z.string()),
			tags: z.array(z.string()),
			views: viewsSchema,
		}),
	),
);

export const utilRouter = router({
	search: publicProcedure
		.input(searchInputSchema)
		.output(searchOutputSchema)
		.query(async ({ input }) => {
			const [count, packages] = await prisma.$transaction([prisma.package.count(), prisma.package.findMany()]);

			return {
				data: packages,
				page: input.page,
				total: count,
			};
		}),

	// featured packages
	// incl publisher
	featured: publicProcedure
		.input(featuredInputSchema)
		.output(featuredOutputSchema)
		.query(async () => {
			const packages = await prisma.package.findMany({
				include: {
					publisher: true,
				},
			});

			const mapped = packages.map((e) => ({
				id: e.id,
				wingetId: e.wingetId,
				name: e.name,
				description: e.description,
				homepage: e.homepage,
				license: e.license,
				licenseUrl: e.licenseUrl,
				featured: e.featured,
				publisherId: e.publisherId,
				publisher: e.publisher.name,
			}));

			return {
				data: mapped,
			};
		}),

	// package
	// incl publisher
	// incl versions
	// incl tags
	// incl stats range
	package: publicProcedure
		.input(packageInputSchema)
		.output(packageOutputSchema)
		.query(async ({ input }) => {
			const pkg = await prisma.package.findFirst({
				where: {
					id: input.id,
				},
				include: {
					publisher: true,
					version: true,
					tag: {
						include: {
							tag: true,
						},
					},
				},
			});

			if (pkg == null) {
				return {
					data: null,
				};
			}

			const pastWeek = new Date();
			pastWeek.setDate(pastWeek.getDate() - 7);

			// TODO: test if this truncates the date correctly
			const stats =
				await prisma.$queryRaw`select date_trunc('date', s.date) "date", count(*) count from "Stat" s where s."packageId" = ${
					input.id
				} and s.date >= ${pastWeek.toISOString()}::date group by 1 order by 1`;

			const views = viewsSchema.parse(stats);

			const mapped = {
				id: pkg.id,
				wingetId: pkg.wingetId,
				name: pkg.name,
				description: pkg.description,
				homepage: pkg.homepage,
				license: pkg.license,
				licenseUrl: pkg.licenseUrl,
				featured: pkg.featured,
				publisherId: pkg.publisherId,
				publisher: pkg.publisher.name,
				versions: pkg.version.map((e) => e.name),
				tags: pkg.tag.map((e) => e.tag.name),
				views,
			};

			return {
				data: mapped,
			};
		}),
});
