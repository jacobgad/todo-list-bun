import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { SESSION_COOKIE_NAME } from "../sessions/utils";
import type { User } from "../users/schema";
import { createFactory } from "hono/factory";
import env from "../utils/env";
import { getSignedCookie } from "hono/cookie";
import sessionService from "../sessions/service";

type IsAuthedEnv = {
  Variables: {
    userId: User["id"];
  };
};

const factory = createFactory<IsAuthedEnv>();

export const isAuthedMiddleware = factory.createMiddleware(async (context, next) => {
  const sessionId = await getSignedCookie(context, env.SESSION_SECRET, SESSION_COOKIE_NAME);
  if (!sessionId) throw new HTTPException(401, { message: "unauthorized" });
  const session = await sessionService.getSessionById(sessionId);
  if (!session) throw new HTTPException(401, { message: "unauthorized" });
  context.set("userId", session.userId);
  await next();
});

export function newIsAuthedRouter() {
  return new Hono().use(isAuthedMiddleware);
}
