import { createTodoSchema, updateTodoSchema } from "./schema";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import todoService from "./service";
import { validateParamId } from "../utils/validation";
import { zValidator } from "@hono/zod-validator";

const todosRouter = new Hono();

todosRouter.get("/", async (context) => {
	const todos = await todoService.getTodoIndex();
	return context.json(todos, 200);
});

todosRouter.post("/", zValidator("json", createTodoSchema), async (context) => {
	const data = context.req.valid("json");
	const todo = await todoService.createTodo(data);
	return context.json(todo, 200);
});

todosRouter.get("/:id", async (context) => {
	const { id } = validateParamId(context.req.param());
	const todo = await todoService.getTodoById(id);
	if (!todo) throw new HTTPException(404, { message: "Todo does not exist" });
	return context.json(todo, 200);
});

todosRouter.put("/:id", zValidator("json", updateTodoSchema), async (context) => {
	const { id } = validateParamId(context.req.param());
	const data = context.req.valid("json");
	const todo = await todoService.updateTodo(id, data);
	if (!todo) throw new HTTPException(404, { message: "Todo does not exist" });
	return context.json(todo, 200);
});

todosRouter.delete("/:id", async (context) => {
	const { id } = validateParamId(context.req.param());
	const todo = await todoService.deleteTodo(id);
	if (!todo) throw new HTTPException(404, { message: "Todo does not exist" });
	return context.json(todo, 200);
});

export default todosRouter;
