import type { Collection, CreateCollection, UpdateCollection } from "./schema";
import { collections } from "../db/schema";
import db from "../db";
import { eq } from "drizzle-orm";

async function getCollectionIndex() {
	const collections = await db.query.collections.findMany({
		with: { todos: true },
	});
	return collections;
}

async function getCollectionById(id: Collection["id"]) {
	const response = await db.query.collections.findFirst({
		where: eq(collections.id, id),
		with: { todos: true },
	});
	const collection = response ?? null;
	return collection;
}

async function createCollection(data: CreateCollection) {
	const response = await db.insert(collections).values(data).returning();
	const collection = response.at(0) ?? null;
	return collection;
}

async function updateCollection(id: Collection["id"], data: UpdateCollection) {
	const response = await db.update(collections).set(data).where(eq(collections.id, id)).returning();
	const collection = response.at(0) ?? null;
	return collection;
}

async function deleteCollection(id: Collection["id"]) {
	const response = await db.delete(collections).where(eq(collections.id, id)).returning();
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
