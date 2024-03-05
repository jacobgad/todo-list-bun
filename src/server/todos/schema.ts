import { z } from "zod";

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodo = z.infer<typeof createTodoSchema>;
export type UpdateTodo = z.infer<typeof updateTodoSchema>;

export const todoSchema = z.object({
	id: z.number(),
	title: z.string().min(1),
	completed: z.boolean().default(false),
	collectionId: z.number(),
});

export const createTodoSchema = todoSchema.omit({ id: true });
export const updateTodoSchema = createTodoSchema.partial();
