import { generateSessionId, getSessionExpiry } from "./utils";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// Collections
export const collections = sqliteTable(
  "collections",
  {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
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
  user: one(users, {
    fields: [collections.userId],
    references: [users.id],
  }),
}));

// Todos
export const todos = sqliteTable(
  "todos",
  {
    id: integer("id").primaryKey(),
    title: text("title").notNull(),
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
});

export const usersRelations = relations(users, ({ many }) => ({
  collections: many(collections),
}));

// Sessions
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().$defaultFn(generateSessionId),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull().$default(getSessionExpiry),
});
