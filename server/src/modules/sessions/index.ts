import { Hono } from "hono";
import { getAllSessions, getSessionByKey } from "./controller";
import { keyValidator } from "../../middleware";

const sessionRouter = new Hono();

sessionRouter.get("/all", getAllSessions);
sessionRouter.get("/:key", keyValidator, getSessionByKey);

export default sessionRouter;
