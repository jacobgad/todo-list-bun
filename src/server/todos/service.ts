import type { CreateTodo, Todo, UpdateTodo } from "./schema";
import { and, eq, inArray } from "drizzle-orm";
import { collections, todos } from "../db/schema";
import type { User } from "../users/schema";
import db from "../db";

const userCollectionIds = (userId: User["id"]) =>
  db.select({ id: collections.id }).from(collections).where(eq(collections.userId, userId));

async function getTodoIndex({ userId }: { userId: User["id"] }) {
  const response = await db
    .select()
    .from(todos)
    .where(inArray(todos.collectionId, userCollectionIds(userId)));
  return response;
}

async function getTodoById({ id, userId }: { id: Todo["id"]; userId: User["id"] }) {
  const response = await db.query.todos.findFirst({
    where: and(eq(todos.id, id), inArray(todos.collectionId, userCollectionIds(userId))),
  });
  const todo = response ?? null;
  return todo;
}

async function createTodo(data: CreateTodo) {
  const response = await db.insert(todos).values(data).returning();
  const todo = response.at(0) ?? null;
  return todo;
}

async function updateTodo({
  id,
  userId,
  data,
}: {
  id: Todo["id"];
  userId: User["id"];
  data: UpdateTodo;
}) {
  const response = await db
    .update(todos)
    .set(data)
    .where(and(eq(todos.id, id), inArray(todos.collectionId, userCollectionIds(userId))))
    .returning();
  const todo = response.at(0) ?? null;
  return todo;
}

async function deleteTodo({ id, userId }: { id: Todo["id"]; userId: User["id"] }) {
  const response = await db
    .delete(todos)
    .where(and(eq(todos.id, id), inArray(todos.collectionId, userCollectionIds(userId))))
    .returning();
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
