import { Hono } from "hono";
import { getLapCount } from "./controller";

const lapCountRouter = new Hono();

lapCountRouter.get("/:key", getLapCount);

export default lapCountRouter;
