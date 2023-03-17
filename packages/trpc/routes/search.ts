import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const searchRouter = router({
	query: publicProcedure.input(z.object({})).query(({ input, ctx }) => {}),
});
