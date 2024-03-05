import { Scrypt } from "lucia";

export async function createPasswordHash(password: string) {
  const scrypt = new Scrypt();
  const hash = await scrypt.hash(password);
  return hash;
}

export function verifyPassword({ hash, password }: { hash: string; password: string }) {
  const scrypt = new Scrypt();
  const isVerified = scrypt.verify(hash, password);
  return isVerified;
}
