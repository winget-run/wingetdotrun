import { createRoute, OpenAPIHono, z, type RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { databaseClient, IdStringParamsSchema, notFoundSchema } from "../util";

// const
const tags = ["Packages"];

// schema
export const packageSchema = z.object({
	// unique
	ident: z.string(),
	slug: z.string(),

	// required
	name: z.string(),
	license: z.string(),
	shortDescription: z.string(),

	// optional
	packageUrl: z.string().url().nullable(),
	licenseUrl: z.string().url().nullable(),
	description: z.string().nullable(),
	tags: z.array(z.string()).nullable(),

	// rels
	publisherIdent: z.string(),
});

// list
const listConfig = createRoute({
	path: "/",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.array(packageSchema), "The list of packages"),
	},
});

const listHandler: RouteHandler<typeof listConfig> = async (c) => {
	const packages = await databaseClient.query.packages.findMany();

	return c.json(packages, HttpStatusCodes.OK);
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
		[HttpStatusCodes.OK]: jsonContent(packageSchema, "The requested package"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Package not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdStringParamsSchema), "Invalid id error"),
	},
});

const getHandler: RouteHandler<typeof getConfig> = async (c) => {
	const { id } = c.req.valid("param");

	const pkg = await databaseClient.query.packages.findFirst({
		where: (packages, { eq }) => eq(packages.slug, id),
	});

	if (pkg == null) {
		return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
	}

	return c.json(pkg, HttpStatusCodes.OK);
};

export const packageRouter = new OpenAPIHono().openapi(listConfig, listHandler).openapi(getConfig, getHandler);
