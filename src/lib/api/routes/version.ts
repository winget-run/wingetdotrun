import { createRoute, OpenAPIHono, z, type RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { databaseClient, IdStringParamsSchema, notFoundSchema } from "../util";

// const
const tags = ["Versions"];

// schema
export const versionSchema = z.object({
	// unique
	ident: z.string(),
	slug: z.string(),

	// required
	latest: z.boolean(),

	// rels
	packageIdent: z.string(),
});

// list
const listConfig = createRoute({
	path: "/",
	method: "get",
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.array(versionSchema), "The list of versions"),
	},
});

const listHandler: RouteHandler<typeof listConfig> = async (c) => {
	const versions = await databaseClient.query.versions.findMany();

	return c.json(versions, HttpStatusCodes.OK);
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
		[HttpStatusCodes.OK]: jsonContent(versionSchema, "The requested version"),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Version not found"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdStringParamsSchema), "Invalid id error"),
	},
});

const getHandler: RouteHandler<typeof getConfig> = async (c) => {
	const { id } = c.req.valid("param");

	const version = await databaseClient.query.versions.findFirst({
		where: (versions, { eq }) => eq(versions.slug, id),
	});

	if (version == null) {
		return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
	}

	return c.json(version, HttpStatusCodes.OK);
};

export const versionRouter = new OpenAPIHono().openapi(listConfig, listHandler).openapi(getConfig, getHandler);
