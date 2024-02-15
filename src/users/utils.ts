import { randomBytes } from "node:crypto";

export async function createPasswordHash(password: string) {
	const passwordSalt = randomBytes(20).toString("hex");
	const passwordHash = await Bun.password.hash(password + passwordSalt);
	return { passwordSalt, passwordHash };
}
