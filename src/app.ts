import { Hono } from "hono";
import collectionsRouter from "./collections/router";
import { logger } from "hono/logger";
import todosRouter from "./todos/router";
import usersRouter from "./users/router";

const app = new Hono().basePath("/api");

app.use("*", logger());

app.route("/users", usersRouter);
app.route("/todos", todosRouter);
app.route("/collections", collectionsRouter);

app.get("/", (context) => {
	return context.text("Todos API");
});

export default app;
