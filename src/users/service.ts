import type { CreateUser, UpdateUser, User } from "./schema";
import { createPasswordHash } from "./utils";
import db from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

/** Internal use only: Hash and salt included */
async function getUserByEmail(email: string) {
	const response = await db.select().from(users).where(eq(users.email, email));
	const user = response.at(0) ?? null;
	return user;
}

async function createUser(data: CreateUser) {
	const { passwordHash, passwordSalt } = await createPasswordHash(data.password);
	const response = await db
		.insert(users)
		.values({ email: data.email, passwordHash, passwordSalt })
		.returning({ id: users.id, email: users.email });
	const user = response.at(0) ?? null;
	return user;
}

async function updateUser(id: User["id"], data: UpdateUser) {
	const { passwordHash, passwordSalt } = data.password
		? await createPasswordHash(data.password)
		: { passwordHash: undefined, passwordSalt: undefined };
	const response = await db
		.update(users)
		.set({ email: data.email, passwordHash, passwordSalt })
		.where(eq(users.id, id))
		.returning();
	const user = response.at(0) ?? null;
	return user;
}

async function deleteUser(id: User["id"]) {
	const response = await db.delete(users).where(eq(users.id, id)).returning();
	const user = response.at(0) ?? null;
	return user;
}

const userService = {
	getUserByEmail,
	createUser,
	updateUser,
	deleteUser,
};

export default userService;
