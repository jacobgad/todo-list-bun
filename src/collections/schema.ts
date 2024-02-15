import { z } from "zod";

export type Collection = z.infer<typeof collectionSchema>;
export type CreateCollection = z.infer<typeof createCollectionSchema>;
export type UpdateCollection = z.infer<typeof updateCollectionSchema>;

export const collectionSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	userId: z.number().positive(),
});

export const createCollectionSchema = collectionSchema.omit({ id: true });
export const updateCollectionSchema = createCollectionSchema.partial();
