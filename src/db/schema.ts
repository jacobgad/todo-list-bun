import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { randomBytes } from "node:crypto";
import { relations } from "drizzle-orm";

// Collections
export const collections = sqliteTable(
	"collections",
	{
		id: integer("id").primaryKey(),
		name: text("name").unique().notNull(),
		userId: integer("user_id")
			.references(() => users.id)
			.notNull(),
	},
	(table) => ({
		unique: unique().on(table.userId, table.name),
	}),
);

export const collectionsRelations = relations(collections, ({ many, one }) => ({
	todos: many(todos),
	user: one(users),
}));

// Todos
export const todos = sqliteTable(
	"todos",
	{
		id: integer("id").primaryKey(),
		title: text("title").unique().notNull(),
		completed: integer("completed", { mode: "boolean" }).notNull(),
		collectionId: integer("collection_id")
			.references(() => collections.id)
			.notNull(),
	},
	(table) => ({
		unique: unique().on(table.collectionId, table.title),
	}),
);

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

export const usersRelations = relations(users, ({ many }) => ({
	collections: many(collections),
}));

// Sessions
export const sessions = sqliteTable("sessions", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => randomBytes(30).toString("hex")),
	userId: integer("user_id")
		.references(() => users.id)
		.notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});
