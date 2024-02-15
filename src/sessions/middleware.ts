import { HTTPException } from "hono/http-exception";
import { SESSION_COOKIE_NAME } from "./utils";
import { createFactory } from "hono/factory";
import env from "../utils/env";
import { getSignedCookie } from "hono/cookie";
import sessionService from "./service";
import userService from "../users/service";

const factory = createFactory();

export const isLoggedIn = factory.createMiddleware(async (context, next) => {
	const sessionId = await getSignedCookie(context, env.SESSION_SECRET, SESSION_COOKIE_NAME);
	if (!sessionId) throw new HTTPException(401, { message: "unauthorized" });
	const session = await sessionService.getSessionById(sessionId);
	if (!session) throw new HTTPException(401, { message: "unauthorized" });
	const user = await userService.getUserById(session.userId);
	if (!user) throw new HTTPException(401, { message: "unauthorized" });
	context.set("user", user);
	await next();
});
