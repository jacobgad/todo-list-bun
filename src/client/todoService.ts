import { type InferRequestType } from "hono/client";
import client from ".";

async function getTodoIndex() {
	const res = await client.todos.$get();
	return res.json();
}

async function getTodoById(data: InferRequestType<(typeof client.todos)[":id"]["$get"]>) {
	const res = await client.todos[":id"].$get(data);
	return res.json();
}

async function createTodo(data: InferRequestType<typeof client.todos.$post>) {
	const res = await client.todos.$post(data);
	return res.json();
}

async function updateTodo(data: InferRequestType<(typeof client.todos)[":id"]["$put"]>) {
	const res = await client.todos[":id"].$put(data);
	return res.json();
}

async function deleteTodo(data: InferRequestType<(typeof client.todos)[":id"]["$delete"]>) {
	const res = await client.todos[":id"].$delete(data);
	return res.json();
}

const todoService = {
	getIndex: getTodoIndex,
	getById: getTodoById,
	create: createTodo,
	update: updateTodo,
	delete: deleteTodo,
};

export default todoService;
