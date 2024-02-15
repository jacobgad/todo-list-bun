import { createUserSchema, updateUserSchema } from "./schema";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import { paramIdSchema } from "../utils/validation";
import userService from "./service";
import { zValidator } from "@hono/zod-validator";

const usersRouter = new Hono();

usersRouter.post("/", zValidator("json", createUserSchema), async (context) => {
	const data = context.req.valid("json");
	const user = await userService.createUser(data);
	return context.json(user, 200);
});

usersRouter.put(
	"/:id",
	zValidator("param", paramIdSchema),
	zValidator("json", updateUserSchema),
	async (context) => {
		const { id } = context.req.valid("param");
		const data = context.req.valid("json");
		const user = await userService.updateUser(id, data);
		if (!user) throw new HTTPException(404, { message: "User does not exist" });
		return context.json(user, 200);
	},
);

usersRouter.delete("/:id", zValidator("param", paramIdSchema), async (context) => {
	const { id } = context.req.valid("param");
	const user = await userService.deleteUser(id);
	if (!user) throw new HTTPException(404, { message: "User does not exist" });
	return context.json(user, 200);
});

export default usersRouter;
