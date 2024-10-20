import { Hono } from "hono";
import { getTimingData } from "./controller";
import { keyValidator } from "../../middleware";

const timingDataRouter = new Hono();

timingDataRouter.get("/:key", keyValidator, getTimingData);

export default timingDataRouter;
