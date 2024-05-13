import { Hono } from "hono";
import { getAllSessions, getSessionByKey } from "./controller";

const sessionRouter = new Hono();

sessionRouter.get("/all", getAllSessions);
sessionRouter.get("/:key", getSessionByKey);

export default sessionRouter;
