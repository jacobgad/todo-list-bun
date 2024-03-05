import type { Collection, CreateCollection, UpdateCollection } from "./schema";
import { and, eq } from "drizzle-orm";
import type { User } from "../users/schema";
import { collections } from "../db/schema";
import db from "../db";

async function getCollectionIndex({ userId }: { userId: User["id"] }) {
  const response = await db.query.collections.findMany({
    with: { todos: true },
    where: eq(collections.userId, userId),
  });
  return response;
}

async function getCollectionById({ id, userId }: { id: Collection["id"]; userId: User["id"] }) {
  const response = await db.query.collections.findFirst({
    where: and(eq(collections.id, id), eq(collections.userId, userId)),
    with: { todos: true },
  });
  const collection = response ?? null;
  return collection;
}

async function createCollection({ data }: { data: CreateCollection }) {
  const response = await db.insert(collections).values(data).returning();
  const collection = response.at(0) ?? null;
  return collection;
}

async function updateCollection({
  id,
  userId,
  data,
}: {
  id: Collection["id"];
  userId: User["id"];
  data: UpdateCollection;
}) {
  const response = await db
    .update(collections)
    .set(data)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .returning();
  const collection = response.at(0) ?? null;
  return collection;
}

async function deleteCollection({ id, userId }: { id: Collection["id"]; userId: User["id"] }) {
  const response = await db
    .delete(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)))
    .returning();
  const collection = response.at(0) ?? null;
  return collection;
}

const collectionService = {
  getCollectionIndex,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};

export default collectionService;
