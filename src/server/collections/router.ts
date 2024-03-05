import { createCollectionSchema, updateCollectionSchema } from "./schema";
import { HTTPException } from "hono/http-exception";
import collectionService from "./service";
import { newIsAuthedRouter } from "../middleware/isAuthed";
import { paramIdSchema } from "../utils/validation";
import { zValidator } from "@hono/zod-validator";

const collectionsRouter = newIsAuthedRouter()
  .get("/", async (context) => {
    const { userId } = context.var;
    const collections = await collectionService.getCollectionIndex({ userId });
    return context.json(collections, 200);
  })

  .post("/", zValidator("json", createCollectionSchema.omit({ userId: true })), async (context) => {
    const userId = context.get("userId");
    const data = context.req.valid("json");
    const collection = await collectionService.createCollection({ data: { ...data, userId } });
    return context.json(collection, 200);
  })

  .get("/:id", zValidator("param", paramIdSchema), async (context) => {
    const { id } = context.req.valid("param");
    const userId = context.get("userId");
    const collection = await collectionService.getCollectionById({ id, userId });
    if (!collection) throw new HTTPException(404, { message: "collection not found" });
    return context.json(collection, 200);
  })

  .put(
    "/:id",
    zValidator("param", paramIdSchema),
    zValidator("json", updateCollectionSchema),
    async (context) => {
      const { id } = context.req.valid("param");
      const data = context.req.valid("json");
      const userId = context.get("userId");
      const collection = await collectionService.updateCollection({ id, userId, data });
      if (!collection) throw new HTTPException(404, { message: "collection not found" });
      return context.json(collection, 200);
    },
  )

  .delete("/:id", zValidator("param", paramIdSchema), async (context) => {
    const { id } = context.req.valid("param");
    const userId = context.get("userId");
    const collection = await collectionService.deleteCollection({ id, userId });
    if (!collection) throw new HTTPException(404, { message: "collection not found" });
    return context.json(collection, 200);
  });

export default collectionsRouter;
