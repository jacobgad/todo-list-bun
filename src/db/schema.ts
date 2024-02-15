import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Collections
export const collections = sqliteTable("collections", {
	id: integer("id").primaryKey(),
	name: text("name").unique().notNull(),
});

export const collectionsRelations = relations(collections, ({ many }) => ({
	todos: many(todos),
}));

// Todos
export const todos = sqliteTable("todos", {
	id: integer("id").primaryKey(),
	title: text("title").unique().notNull(),
	completed: integer("completed", { mode: "boolean" }).notNull(),
	collectionId: integer("collection_id")
		.references(() => collections.id)
		.notNull(),
});

export const todosRelations = relations(todos, ({ one }) => ({
	collection: one(collections, {
		fields: [todos.collectionId],
		references: [collections.id],
	}),
}));

// Users
export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	email: text("email").unique().notNull(),
	passwordHash: text("password_hash").notNull(),
	passwordSalt: text("password_salt").notNull(),
});
