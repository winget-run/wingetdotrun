import { createRoute, OpenAPIHono, type RouteHandler } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import z from "zod";
import { QueryStringParamsSchema, searchHelpers } from "../util";

// const
const tags = ["Search"];

// schema
export const searchSchema = z.object({
	ident: z.string(),
	name: z.string(),
	tags: z.array(z.string()),
	shortDescription: z.string(),
});

// search
const searchConfig = createRoute({
	path: "/",
	method: "get",
	tags,
	request: {
		query: QueryStringParamsSchema,
	},
	responses: {
		[HttpStatusCodes.OK]: jsonContent(z.array(searchSchema), "The search results"),
		[HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(QueryStringParamsSchema),
			"Invalid query error",
		),
	},
});

const searchHandler: RouteHandler<typeof searchConfig> = async (c) => {
	const { query } = c.req.query();

	const search = await searchHelpers.searchPackages(query);

	return c.json(search, HttpStatusCodes.OK);
};

export const searchRouter = new OpenAPIHono().openapi(searchConfig, searchHandler);
