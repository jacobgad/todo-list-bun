import type { TodosApi } from "../app";
import { hc } from "hono/client";

const client = hc<TodosApi>("http://localhost:3000/");

export default client;
