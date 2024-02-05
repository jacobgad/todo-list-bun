import type { CreateTodo, Todo, UpdateTodo } from "./schema";
import db from "../db";
import { eq } from "drizzle-orm";
import { todos } from "../db/schema";

async function getTodoIndex() {
	const todos = await db.query.todos.findMany();
	return todos;
}

async function getTodoById(id: Todo["id"]) {
	const todo = await db.query.todos.findMany({ where: eq(todos.id, id) });
	if (todo.length < 1) return null;
	return todo[0];
}

async function createTodo(data: CreateTodo) {
	const todo = await db.insert(todos).values(data).returning();
	return todo[0];
}

async function updateTodo(id: Todo["id"], data: UpdateTodo) {
	const todo = await db.update(todos).set(data).where(eq(todos.id, id)).returning();
	if (todo.length < 1) return null;
	return todo[0];
}

async function deleteTodo(id: Todo["id"]) {
	const todo = await db.delete(todos).where(eq(todos.id, id)).returning();
	if (todo.length < 1) return null;
	return todo[0];
}

const todoService = {
	getTodoIndex,
	getTodoById,
	createTodo,
	updateTodo,
	deleteTodo,
};

export default todoService;
