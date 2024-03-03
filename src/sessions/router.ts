import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { SESSION_COOKIE_NAME } from "./utils";
import { add } from "date-fns";
import { createUserSchema } from "../users/schema";
import env from "../utils/env";
import { isAuthedMiddleware } from "../middleware/isAuthed";
import { newPublicRouter } from "../middleware/public";
import sessionService from "./service";
import userService from "../users/service";
import { zValidator } from "@hono/zod-validator";

const sessionsRouter = newPublicRouter()
	.get('/', isAuthedMiddleware, (context) => {
		const userId = context.get('userId')
		return context.text(String(userId), 200)
	})

	.post("/", zValidator("json", createUserSchema), async (context) => {
		const data = context.req.valid("json");
		const user = await userService.getUserByEmail(data.email);
		if (!user) throw new HTTPException(401, { message: "Email or password incorrect" });
		const isAuthed = await Bun.password.verify(
			data.password + user.passwordSalt,
			user.passwordHash,
		);
		if (!isAuthed) throw new HTTPException(401, { message: "Email or password incorrect" });
		const expiresAt = add(new Date(), { months: 1 });
		const session = await sessionService.createSession({ userId: user.id, expiresAt });
		if (!session) throw new HTTPException(400, { message: "Error creating session" });
		await setSignedCookie(context, SESSION_COOKIE_NAME, session.id, env.SESSION_SECRET, {
			httpOnly: true,
			expires: expiresAt,
			secure: env.NODE_ENV === "development" ? false : true,
		});
		return context.text("session created", 200);
	})

	.delete("/", async (context) => {
		const sessionId = await getSignedCookie(context, env.SESSION_SECRET, SESSION_COOKIE_NAME);
		if (!sessionId) throw new HTTPException(404, { message: "Session invalid" });
		const session = await sessionService.deleteSession(sessionId);
		if (!session) throw new HTTPException(404, { message: "Session does not exist" });
		deleteCookie(context, SESSION_COOKIE_NAME);
		return context.text("session deleted", 200);
	});

export default sessionsRouter;
