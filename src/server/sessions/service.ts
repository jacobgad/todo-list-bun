import type { CreateSession, Session } from "./schema";
import { and, eq, gt } from "drizzle-orm";
import db from "../db";
import { sessions } from "../db/schema";

async function getSessionById(id: Session["id"]) {
  const response = await db.query.sessions.findFirst({
    where: and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())),
  });
  const session = response ?? null;
  return session;
}

async function createSession(data: CreateSession) {
  const response = await db.insert(sessions).values(data).returning();
  const todo = response.at(0) ?? null;
  return todo;
}

async function deleteSession(id: Session["id"]) {
  const response = await db.delete(sessions).where(eq(sessions.id, id)).returning();
  const todo = response.at(0) ?? null;
  return todo;
}

const sessionService = {
  getSessionById,
  createSession,
  deleteSession,
};

export default sessionService;
