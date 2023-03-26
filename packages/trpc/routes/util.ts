import { packageModel, publisherModel, prisma } from "@wingetdotrun/prisma";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {
	createListInputSchema,
	createListOutputSchema,
	createGenericOutputSchema,
	createFindOutputSchema,
	createFindInputSchema,
} from "../util";

const MIN_SPECIAL = 1;
const MAX_SPECIAL = 20;
const DEFAULT_SPECIAL = 8;

const QUERY_MIN_LEN = 3;
const QUERY_MAX_LEN = 50;

const viewsSchema = z.array(
	z.object({
		date: z.date(),
		views: z.number(),
	}),
);

const publisherPackageSchema = packageModel.merge(z.object({ publisher: z.string() }));
const searchPackageSchema = publisherPackageSchema.merge(z.object({ score: z.number() }));

const searchInputSchema = createListInputSchema(z.object({ query: z.string().min(QUERY_MIN_LEN).max(QUERY_MAX_LEN) }));
const featuredInputSchema = z.object({
	featured: z.number().gte(MIN_SPECIAL).lte(MAX_SPECIAL).default(DEFAULT_SPECIAL),
	popular: z.number().gte(MIN_SPECIAL).lte(MAX_SPECIAL).default(DEFAULT_SPECIAL),
	recent: z.number().gte(MIN_SPECIAL).lte(MAX_SPECIAL).default(DEFAULT_SPECIAL),
});
const packageInputSchema = z.object({ wingetId: z.string() });

const searchOutputSchema = createListOutputSchema(searchPackageSchema);
const countOutputSchema = z.object({ data: z.number() });
const featuredOutputSchema = createGenericOutputSchema(
	z.object({
		featured: z.array(publisherPackageSchema),
		popular: z.array(publisherPackageSchema),
		recent: z.array(publisherPackageSchema),
	}),
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

const mapPublisherPackage = (
	pkg: z.infer<typeof packageModel> & { publisher: z.infer<typeof publisherModel> },
): z.infer<typeof publisherPackageSchema> => ({
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
	updatedAt: pkg.updatedAt,
	createdAt: pkg.createdAt,
	logoUrl: pkg.logoUrl,
});

export const utilRouter = router({
	search: publicProcedure
		.input(searchInputSchema)
		.output(searchOutputSchema)
		.query(async ({ input }) => {
			const [countRaw, packagesRaw] = await prisma.$transaction([
				prisma.$queryRaw`with input as (select ${input.query} as q) select count(*) from "Package" p, input where input.q % p.name`,
				prisma.$queryRaw`with input as (select ${
					input.query
				} as q) select *, pub.id as publisherId, pub.name as publisher, p.description, p.logoUrl, 1.0 - (p.name <-> input.q) as score from "Package" p join "Publisher" pub on (p."publisherId" = pub.id), input where input.q % p.name order by input.q <-> p.name limit ${
					input.perPage
				} offset ${input.page * input.perPage}`,
			]);

			const count = z.number().parse(countRaw);
			const packages = z.array(searchPackageSchema).parse(packagesRaw);

			return {
				data: packages,
				page: input.page,
				total: count,
			};
		}),

	count: publicProcedure.output(countOutputSchema).query(async () => {
		const count = await prisma.package.count();

		return {
			data: count,
		};
	}),

	featured: publicProcedure
		.input(featuredInputSchema)
		.output(featuredOutputSchema)
		.query(async ({ input }) => {
			const pastWeek = new Date();
			pastWeek.setDate(pastWeek.getDate() - 7);

			const [featured, popular, recent] = await prisma.$transaction([
				prisma.package.findMany({
					include: {
						publisher: true,
					},
					where: {
						featured: true,
					},
					take: input.featured,
				}),
				prisma.package.findMany({
					include: {
						publisher: true,
						stat: {
							where: {
								date: {
									gte: pastWeek,
								},
							},
						},
						_count: {
							select: {
								stat: true,
							},
						},
					},
					orderBy: {
						stat: {
							_count: "desc",
						},
					},
					take: input.popular,
				}),
				prisma.package.findMany({
					include: {
						publisher: true,
					},
					orderBy: {
						updatedAt: "desc",
					},
					take: input.recent,
				}),
			]);

			return {
				data: {
					featured: featured.map(mapPublisherPackage),
					popular: popular.map(mapPublisherPackage),
					recent: recent.map(mapPublisherPackage),
				},
			};
		}),

	package: publicProcedure
		.input(packageInputSchema)
		.output(packageOutputSchema)
		.query(async ({ input }) => {
			const pastWeek = new Date();
			pastWeek.setDate(pastWeek.getDate() - 7);

			const [pkg, viewsRaw] = await prisma.$transaction([
				prisma.package.findFirst({
					where: {
						wingetId: input.wingetId,
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
				}),
				prisma.$queryRaw`select date_trunc('day', s.date) "date", count(*) count from "Package" p join "Stat" s on (p.id = s."packageId") where p."wingetId" = ${
					input.wingetId
				} and s.date >= ${pastWeek.toISOString()}::date group by 1 order by 1`,
			]);

			if (pkg == null) {
				return {
					data: null,
				};
			}

			const views = viewsSchema.parse(viewsRaw);

			const mapped = {
				id: pkg.id,
				wingetId: pkg.wingetId,
				name: pkg.name,
				description: pkg.description,
				homepage: pkg.homepage,
				license: pkg.license,
				licenseUrl: pkg.licenseUrl,
				featured: pkg.featured,
				logoUrl: pkg.logoUrl,
				bannerUrl: pkg.bannerUrl,
				publisherId: pkg.publisherId,
				publisher: pkg.publisher.name,
				versions: pkg.version.map((e) => e.name),
				tags: pkg.tag.map((e) => e.tag.name),
				createdAt: pkg.createdAt,
				updatedAt: pkg.updatedAt,
				views,
			};

			return {
				data: mapped,
			};
		}),
});
