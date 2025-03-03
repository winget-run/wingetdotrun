import { NODE_LOG } from "$env/static/private";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { pinoLogger } from "hono-pino";
import { packageRouter } from "./routes/package";
import { publisherRouter } from "./routes/publisher";
import { searchRouter } from "./routes/search";
import { versionRouter } from "./routes/version";

const app = new OpenAPIHono()
	.basePath("/api")
	.route(
		"/v3",
		new OpenAPIHono()
			.route("/packages", packageRouter)
			.route("/publishers", publisherRouter)
			.route("/versions", versionRouter)
			.route("/search", searchRouter),
	);

app
	.doc("/openapi.json", {
		openapi: "3.0.0",
		info: {
			version: "v3",
			title: "Winget.run API Reference",
		},
	})
	.get(
		"/docs",
		apiReference({
			theme: "kepler",
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "fetch",
			},
			spec: {
				url: "/api/openapi.json",
			},
		}),
	);

// TODO: does this actually work???
app.use(pinoLogger({ pino: { level: NODE_LOG } }));

export const api = app;

export type Router = typeof app;
