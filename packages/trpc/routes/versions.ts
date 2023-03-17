import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const versionRouter = router({
	find: publicProcedure.input(z.object({})).query(({ input, ctx }) => {}),
	list: publicProcedure.input(z.object({})).query(({ input, ctx }) => {}),
	create: publicProcedure.input(z.object({})).mutation(({ input, ctx }) => {}),
	update: publicProcedure.input(z.object({})).mutation(({ input, ctx }) => {}),
	delete: publicProcedure.input(z.object({})).mutation(({ input, ctx }) => {}),
});
