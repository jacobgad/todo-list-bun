import { Hono } from "hono";
import collectionsRouter from "./collections/router";
import { logger } from "hono/logger";
import sessionsRouter from "./sessions/router";
import todosRouter from "./todos/router";
import usersRouter from "./users/router";

const app = new Hono().basePath("/api");

app.use("*", logger());

app.route("/collections", collectionsRouter);
app.route("/todos", todosRouter);
app.route("/sessions", sessionsRouter);
app.route("/users", usersRouter);

app.get("/", (context) => {
	return context.text("Todos API");
});

export default app;
