import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma, packageModel } from "@wingetdotrun/prisma";

export const packageRouter = router({
	find: publicProcedure.input(z.object({})).query(({ input, ctx }) => {}),
	list: publicProcedure.input(z.object({ name: z.string() })).query(({ input, ctx }) => {
		return { hello: input.name };
	}),
	create: publicProcedure.input(packageModel).mutation(({ input, ctx }) => {}),
	update: publicProcedure.input(packageModel.partial()).mutation(({ input, ctx }) => {}),
	delete: publicProcedure.input(z.string()).mutation(({ input, ctx }) => {}),
});
