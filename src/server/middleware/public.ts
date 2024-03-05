import { Hono } from "hono";

export function newPublicRouter() {
	return new Hono();
}
