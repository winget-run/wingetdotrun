import { defineConfig } from "drizzle-kit";
import z from "zod";
import { validate } from "./src/lib/util";

process.loadEnvFile();

const parsed = validate(
	process.env,
	z.object({
		DATABASE_URL: z.string(),
		DATABASE_TOKEN: z.string().optional(),
	}),
	"drizzle.config",
);

export default defineConfig({
	out: "./.drizzle",
	schema: "./src/lib/db/schema.ts",
	dialect: "turso",
	dbCredentials: {
		url: parsed.DATABASE_URL,
		authToken: parsed.DATABASE_TOKEN,
	},
});
