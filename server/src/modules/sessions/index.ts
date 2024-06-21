import { Hono } from "hono";
import { getAllSessions, getSessionByKey } from "./controller";
import { keyValidator } from "../../middleware";

const sessionRouter = new Hono();

sessionRouter.get("/all", getAllSessions);
sessionRouter.get("/:name/:year/:type", getSessionByKey);

export default sessionRouter;
