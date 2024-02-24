import { createUserSchema, updateUserSchema } from "./schema";
import { HTTPException } from "hono/http-exception";
import { isAuthedMiddleware } from "../middleware/isAuthed";
import { newPublicRouter } from "../middleware/public";
import { paramIdSchema } from "../utils/validation";
import userService from "./service";
import { zValidator } from "@hono/zod-validator";

const usersRouter = newPublicRouter()
	.post("/", zValidator("json", createUserSchema), async (context) => {
		const data = context.req.valid("json");
		const user = await userService.createUser(data);
		return context.json(user, 200);
	})

	.put(
		"/:id",
		isAuthedMiddleware,
		zValidator("param", paramIdSchema),
		zValidator("json", updateUserSchema),
		async (context) => {
			const { id } = context.req.valid("param");
			const userId = context.get("userId");
			if (id !== userId) throw new HTTPException(401, { message: "unauthorized" });
			const data = context.req.valid("json");
			const user = await userService.updateUser(id, data);
			if (!user) throw new HTTPException(404, { message: "User does not exist" });
			return context.json(user, 200);
		},
	)

	.delete("/:id", isAuthedMiddleware, zValidator("param", paramIdSchema), async (context) => {
		const { id } = context.req.valid("param");
		const userId = context.get("userId");
		if (id !== userId) throw new HTTPException(401, { message: "unauthorized" });
		const user = await userService.deleteUser(id);
		if (!user) throw new HTTPException(404, { message: "User does not exist" });
		return context.json(user, 200);
	});

export default usersRouter;
