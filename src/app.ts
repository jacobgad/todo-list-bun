import { Hono } from "hono";
import collectionsRouter from "./collections/router";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import sessionsRouter from "./sessions/router";
import todosRouter from "./todos/router";
import usersRouter from "./users/router";

const app = new Hono()
	.basePath("/api")

	.use(logger())
	.use(secureHeaders())
	.use(cors({ origin: "*", credentials: true }))

	.route("/collections", collectionsRouter)
	.route("/todos", todosRouter)
	.route("/sessions", sessionsRouter)
	.route("/users", usersRouter)

	.get("/", (context) => {
		return context.text("Todos API");
	});

export default app;
