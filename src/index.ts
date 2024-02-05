import { Hono } from "hono";
import collectionsRouter from "./collections/router";
import todosRouter from "./todos/router";

const app = new Hono();

app.route("/todos", todosRouter);
app.route("/collections", collectionsRouter);

app.get("/", (context) => {
	return context.text("Todos API");
});

export default app;
