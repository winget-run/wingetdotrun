import { Prisma, PrismaClient } from "@prisma/client";
export * from "./zod";

declare global {
	var prisma: PrismaClient | null;
}

const prismaOptions: Prisma.PrismaClientOptions = {};

export const prisma = globalThis.prisma ?? new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
	globalThis.prisma = prisma;
}
