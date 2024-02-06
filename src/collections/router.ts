import { createCollectionSchema, updateCollectionSchema } from "./schema";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import collectionService from "./service";
import { paramIdSchema } from "../utils/validation";
import { zValidator } from "@hono/zod-validator";

const collectionsRouter = new Hono();

collectionsRouter.get("/", async (context) => {
	const collections = await collectionService.getCollectionIndex();
	return context.json(collections, 200);
});

collectionsRouter.post("/", zValidator("json", createCollectionSchema), async (context) => {
	const data = context.req.valid("json");
	const collection = await collectionService.createCollection(data);
	return context.json(collection, 200);
});

collectionsRouter.get("/:id", zValidator("param", paramIdSchema), async (context) => {
	const { id } = context.req.valid("param");
	const collection = await collectionService.getCollectionById(id);
	if (!collection) throw new HTTPException(404, { message: "collection not found" });
	return context.json(collection, 200);
});

collectionsRouter.put(
	"/:id",
	zValidator("param", paramIdSchema),
	zValidator("json", updateCollectionSchema),
	async (context) => {
		const { id } = context.req.valid("param");
		const data = context.req.valid("json");
		const collection = await collectionService.updateCollection(id, data);
		if (!collection) throw new HTTPException(404, { message: "collection not found" });
		return context.json(collection, 200);
	},
);

collectionsRouter.delete("/:id", zValidator("param", paramIdSchema), async (context) => {
	const { id } = context.req.valid("param");
	const collection = await collectionService.deleteCollection(id);
	if (!collection) throw new HTTPException(404, { message: "collection not found" });
	return context.json(collection, 200);
});

export default collectionsRouter;
