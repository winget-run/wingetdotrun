import { createRoute, OpenAPIHono, z, type RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { databaseClient, IdStringParamsSchema, notFoundSchema } from "../util";

// const
const tags = ["Publishers"];

// schema
export const publisherSchema = z.object({
	// unique
	ident: z.string(),
	slug: z.string(),

	// required
	name: z.string(),
	aliases: z.array(z.string()).nullable(),

	// optional
	publisherUrl: z.string().url().nullish(),

	// rels
	packages: z.array(z.string()),
});

// list
const listConfig = createRoute({
	path: "/",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.array(publisherSchema), "The list of publishers"),
	},
});

const listHandler: RouteHandler<typeof listConfig> = async (c) => {
	const publishers = await databaseClient.query.publishers.findMany({
		with: {
			packages: true,
		},
	});

	return c.json(
		publishers.map((p) => ({ ...p, packages: p.packages.map((p) => p.slug) })),
		HttpStatusCodes.OK,
	);
};

// get
const getConfig = createRoute({
	path: "/{id}",
	method: "get",
	tags,
	request: {
		params: IdStringParamsSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(publisherSchema, "The requested publisher"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Publisher not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdStringParamsSchema), "Invalid id error"),
	},
});

const getHandler: RouteHandler<typeof getConfig> = async (c) => {
	const { id } = c.req.valid("param");

	const publisher = await databaseClient.query.publishers.findFirst({
		where: (publishers, { eq }) => eq(publishers.slug, id),
		with: {
			packages: true,
		},
	});

	if (publisher == null) {
		return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
	}

	return c.json(
		{
			...publisher,
			packages: publisher.packages.map((p) => p.slug),
		},
		HttpStatusCodes.OK,
	);
};

export const publisherRouter = new OpenAPIHono().openapi(listConfig, listHandler).openapi(getConfig, getHandler);
