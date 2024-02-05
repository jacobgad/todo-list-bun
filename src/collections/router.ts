import { createCollectionSchema, updateCollectionSchema } from "./schema";
import { HTTPException } from "hono/http-exception";
import { Hono } from "hono";
import collectionService from "./service";
import { z } from "zod";

const collectionsRouter = new Hono();

collectionsRouter.get("/", async (context) => {
	const collections = await collectionService.getCollectionIndex();
	return context.json(collections, 200);
});

collectionsRouter.post("/", async (context) => {
	const body = await context.req.json();
	const data = createCollectionSchema.parse(body);
	const collection = await collectionService.createCollection(data);
	return context.json(collection, 200);
});

collectionsRouter.get("/:id", async (context) => {
	const params = context.req.param();
	const id = z.coerce.number().parse(params.id);
	const collection = await collectionService.getCollectionById(id);
	if (!collection) throw new HTTPException(404, { message: "collection not found" });
	return context.json(collection, 200);
});

collectionsRouter.put("/:id", async (context) => {
	const params = context.req.param();
	const id = z.coerce.number().parse(params.id);
	const body = await context.req.json();
	const data = updateCollectionSchema.parse(body);
	const collection = await collectionService.updateCollection(id, data);
	if (!collection) throw new HTTPException(404, { message: "collection not found" });
	return context.json(collection, 200);
});

collectionsRouter.delete("/:id", async (context) => {
	const params = context.req.param();
	const id = z.coerce.number().parse(params.id);
	const collection = await collectionService.deleteCollection(id);
	if (!collection) throw new HTTPException(404, { message: "collection not found" });
	return context.json(collection, 200);
});

export default collectionsRouter;
