import { z } from "zod";

export type Session = z.infer<typeof sessionSchema>;
export type CreateSession = z.infer<typeof createSessionSchema>;

export const sessionSchema = z.object({
	id: z.string(),
	userId: z.number(),
});

export const createSessionSchema = sessionSchema.omit({ id: true });
