import { eq } from 'drizzle-orm';
import db from '../db';
import { collections } from '../db/schema';
import type { Collection, CreateCollection, UpdateCollection } from './schema';

async function getCollectionIndex() {
	const collections = await db.query.collections.findMany({
		with: { todos: true },
	});
	return collections;
}

async function getCollectionById(id: Collection['id']) {
	const collection = await db.query.collections.findMany({
		where: eq(collections.id, id),
		with: { todos: true },
	});
	if (collection.length < 1) return null;
	return collection[0];
}

async function createCollection(data: CreateCollection) {
	const collection = await db.insert(collections).values(data).returning();
	return collection[0];
}

async function updateCollection(id: Collection['id'], data: UpdateCollection) {
	const collection = await db
		.update(collections)
		.set(data)
		.where(eq(collections.id, id))
		.returning();
	if (collection.length < 1) return null;
	return collection[0];
}

async function deleteCollection(id: Collection['id']) {
	const collection = await db.delete(collections).where(eq(collections.id, id)).returning();
	if (collection.length < 1) return null;
	return collection[0];
}

const collectionService = {
	getCollectionIndex,
	getCollectionById,
	createCollection,
	updateCollection,
	deleteCollection,
};

export default collectionService;
