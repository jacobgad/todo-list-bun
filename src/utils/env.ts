import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string(),
	DATABASE_AUTH_TOKEN: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;
