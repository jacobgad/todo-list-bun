import { type Schema, z } from "zod";
import { HTTPException } from "hono/http-exception";

function zodValidator(schema: Schema, data: unknown) {
	const result = schema.safeParse(data);
	if (!result.success) throw new HTTPException(400, { message: result.error.message });
	return result.data;
}

const paramIdSchema = z.object({ id: z.coerce.number().positive() });
export const validateParamId = (param: unknown) => zodValidator(paramIdSchema, param);
