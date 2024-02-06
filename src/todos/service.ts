import type { CreateTodo, Todo, UpdateTodo } from "./schema";
import db from "../db";
import { eq } from "drizzle-orm";
import { todos } from "../db/schema";

async function getTodoIndex() {
	const todos = await db.query.todos.findMany();
	return todos;
}

async function getTodoById(id: Todo["id"]) {
	const response = await db.query.todos.findFirst({ where: eq(todos.id, id) });
	const todo = response ?? null;
	return todo;
}

async function createTodo(data: CreateTodo) {
	const response = await db.insert(todos).values(data).returning();
	const todo = response.at(0) ?? null;
	return todo;
}

async function updateTodo(id: Todo["id"], data: UpdateTodo) {
	const response = await db.update(todos).set(data).where(eq(todos.id, id)).returning();
	const todo = response.at(0) ?? null;
	return todo;
}

async function deleteTodo(id: Todo["id"]) {
	const response = await db.delete(todos).where(eq(todos.id, id)).returning();
	const todo = response.at(0) ?? null;
	return todo;
}

const todoService = {
	getTodoIndex,
	getTodoById,
	createTodo,
	updateTodo,
	deleteTodo,
};

export default todoService;
