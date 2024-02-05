import { Hono } from 'hono';
import todoService from './service';
import { z } from 'zod';
import { createTodoSchema, updateTodoSchema } from './schema';
import { HTTPException } from 'hono/http-exception';

const todosRouter = new Hono();

todosRouter.get('/', async (context) => {
	const todos = await todoService.getTodoIndex();
	return context.json(todos, 200);
});

todosRouter.post('/', async (context) => {
	const data = await context.req.json();
	const newTodo = createTodoSchema.parse(data);
	const savedTodo = await todoService.createTodo(newTodo);
	return context.json(savedTodo, 200);
});

todosRouter.get('/:id', async (context) => {
	const { id } = context.req.param();
	const todoId = z.coerce.number().parse(id);
	const todo = await todoService.getTodoById(todoId);
	if (!todo) throw new HTTPException(404, { message: 'Todo does not exist' });
	return context.json(todo, 200);
});

todosRouter.put('/:id', async (context) => {
	const { id } = context.req.param();
	const todoId = z.coerce.number().parse(id);
	const body = await context.req.json();
	const data = updateTodoSchema.parse(body);
	const todo = await todoService.updateTodo(todoId, data);
	if (!todo) throw new HTTPException(404, { message: 'Todo does not exist' });
	return context.json(todo, 200);
});

todosRouter.delete('/:id', async (context) => {
	const { id } = context.req.param();
	const todoId = z.coerce.number().parse(id);
	const todo = await todoService.deleteTodo(todoId);
	if (!todo) throw new HTTPException(404, { message: 'Todo does not exist' });
	return context.json(todo, 200);
});

export default todosRouter;
