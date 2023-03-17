import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import { packageRouter } from "./routes/packages";
import { publisherRouter } from "./routes/publishers";
import { searchRouter } from "./routes/search";
import { statRouter } from "./routes/stats";
import { tagRouter } from "./routes/tags";
import { versionRouter } from "./routes/versions";
import { publicProcedure, router as trpcRouter } from "./trpc";

export { createContext } from "./context";

export const router = trpcRouter({
	packages: packageRouter,
	publishers: publisherRouter,
	search: searchRouter,
	stats: statRouter,
	tags: tagRouter,
	versions: versionRouter,
});

export type Router = typeof router;
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
