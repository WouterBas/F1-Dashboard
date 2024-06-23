import { Hono } from "hono";
import { getAllSessions, getSessionBySlug } from "./controller";
import { keyValidator } from "../../middleware";

const sessionRouter = new Hono();

sessionRouter.get("/all", getAllSessions);
sessionRouter.get("/:name/:year/:type", getSessionBySlug);

export default sessionRouter;
