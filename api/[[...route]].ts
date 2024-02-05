import { Hono } from "hono";
import app from "../src/app";
import { handle } from "hono/vercel";

export const runtime = "edge";

const vercelApp = new Hono().basePath("/api");
vercelApp.route("*", app);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
