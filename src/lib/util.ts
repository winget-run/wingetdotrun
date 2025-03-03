import pino from "pino";
import z from "zod";

export const DEFAULT_LOG_LEVEL: LogLevel = "info";

export const logLevelSchema = z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]);
export type LogLevel = z.infer<typeof logLevelSchema>;

export const logger = pino();

export const validate = <T extends z.ZodTypeAny>(
	data: unknown,
	schema: T,
	context: null | string = null,
): z.infer<typeof schema> => {
	const parsed = schema.safeParse(data);

	if (!parsed.success) {
		logger.error(parsed.error);

		throw new Error(`validation error${context == null ? "" : ` '${context}'`}`, { cause: parsed.error });
	}

	return parsed.data;
};
