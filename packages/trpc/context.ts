import { inferAsyncReturnType } from "@trpc/server";

export const createContext = async () => {
	return {};
};

export type Context = inferAsyncReturnType<typeof createContext>;
