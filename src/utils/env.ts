import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	DATABASE_URL: z.string().default("file:sqlite.db"),
	DATABASE_AUTH_TOKEN: z.string().optional(),
	SESSION_SECRET: z.string().min(20),
});

const env = envSchema.parse(process.env);

export default env;
