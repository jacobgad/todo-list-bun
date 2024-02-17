import { createTodoSchema, updateTodoSchema } from "./schema";
import { HTTPException } from "hono/http-exception";
import collectionService from "../collections/service";
import { newIsAuthedRouter } from "../middleware/isAuthed";
import { paramIdSchema } from "../utils/validation";
import todoService from "./service";
import { zValidator } from "@hono/zod-validator";

const todosRouter = newIsAuthedRouter();

todosRouter.get("/", async (context) => {
	const { userId } = context.var;
	const todos = await todoService.getTodoIndex({ userId });
	return context.json(todos, 200);
});

todosRouter.post("/", zValidator("json", createTodoSchema), async (context) => {
	const data = context.req.valid("json");
	const { userId } = context.var;
	const collection = await collectionService.getCollectionById({ id: data.collectionId, userId });
	if (!collection) throw new HTTPException(404, { message: "collection not found" });
	const todo = await todoService.createTodo(data);
	return context.json(todo, 200);
});

todosRouter.get("/:id", zValidator("param", paramIdSchema), async (context) => {
	const { id } = context.req.valid("param");
	const { userId } = context.var;
	const todo = await todoService.getTodoById({ id, userId });
	if (!todo) throw new HTTPException(404, { message: "todo not found" });
	return context.json(todo, 200);
});

todosRouter.put(
	"/:id",
	zValidator("param", paramIdSchema),
	zValidator("json", updateTodoSchema),
	async (context) => {
		const { id } = context.req.valid("param");
		const { userId } = context.var;
		const data = context.req.valid("json");
		const todo = await todoService.updateTodo({ id, userId, data });
		if (!todo) throw new HTTPException(404, { message: "todo not found" });
		return context.json(todo, 200);
	},
);

todosRouter.delete("/:id", zValidator("param", paramIdSchema), async (context) => {
	const { id } = context.req.valid("param");
	const { userId } = context.var;
	const todo = await todoService.deleteTodo({ id, userId });
	if (!todo) throw new HTTPException(404, { message: "todo not found" });
	return context.json(todo, 200);
});

export default todosRouter;
