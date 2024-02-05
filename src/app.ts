import { Hono } from "hono";
import collectionsRouter from "./collections/router";
import { logger } from "hono/logger";
import todosRouter from "./todos/router";

const app = new Hono();

app.use("*", logger());

app.route("/todos", todosRouter);
app.route("/collections", collectionsRouter);

app.get("/", (context) => {
	return context.text("Todos API");
});

export default app;
