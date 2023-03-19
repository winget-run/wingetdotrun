import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const searchRouter = router({
	stats: publicProcedure.input(z.object({})).query(({ input, ctx }) => {}),
	packages: publicProcedure.input(z.object({})).query(({ input, ctx }) => {}),
});
