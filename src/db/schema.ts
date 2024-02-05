import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const collections = sqliteTable('collections', {
	id: integer('id').primaryKey(),
	name: text('name').unique().notNull(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
	todos: many(todos),
}));

export const todos = sqliteTable('todos', {
	id: integer('id').primaryKey(),
	title: text('title').unique().notNull(),
	completed: integer('completed', { mode: 'boolean' }).notNull(),
	collectionId: integer('collection_id')
		.references(() => collections.id)
		.notNull(),
});

export const todosRelations = relations(todos, ({ one }) => ({
	collection: one(collections, {
		fields: [todos.collectionId],
		references: [collections.id],
	}),
}));
