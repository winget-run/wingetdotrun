import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { packageRouter } from "./routes/packages";
import { publisherRouter } from "./routes/publishers";
import { statRouter } from "./routes/stats";
import { tagRouter } from "./routes/tags";
import { utilRouter } from "./routes/util";
import { versionRouter } from "./routes/versions";
import { router as trpcRouter } from "./trpc";

export { createContext } from "./context";

export const router = trpcRouter({
	packages: packageRouter,
	publishers: publisherRouter,
	stats: statRouter,
	tags: tagRouter,
	util: utilRouter,
	versions: versionRouter,
});

export type Router = typeof router;
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
