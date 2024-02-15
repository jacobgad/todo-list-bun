import { HTTPException } from "hono/http-exception";
import { SESSION_COOKIE_NAME } from "./utils";
import { User } from "../users/schema";
import { createFactory } from "hono/factory";
import env from "../utils/env";
import { getSignedCookie } from "hono/cookie";
import sessionService from "./service";
import userService from "../users/service";

export type Variables = {
	userId: User["id"];
};

const factory = createFactory();

export const isAuthed = factory.createMiddleware(async (context, next) => {
	const sessionId = await getSignedCookie(context, env.SESSION_SECRET, SESSION_COOKIE_NAME);
	if (!sessionId) throw new HTTPException(401, { message: "unauthorized" });
	const session = await sessionService.getSessionById(sessionId);
	if (!session) throw new HTTPException(401, { message: "unauthorized" });
	const user = await userService.getUserById(session.userId);
	if (!user) throw new HTTPException(401, { message: "unauthorized" });
	context.set("userId", user.id);
	await next();
});
