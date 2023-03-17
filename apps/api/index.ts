import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import createLogger from "pino";
import { router, createContext } from "@wingetdotrun/trpc";
import cors from "@fastify/cors";

const logger = createLogger();

const server = fastify({
	maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
	prefix: "/trpc",
	trpcOptions: { router, createContext },
});

server.register(cors, {
	origin: "*",
});

try {
	await server.listen({ port: 3000 });
} catch (err) {
	logger.error(err);

	process.exit(1);
}
