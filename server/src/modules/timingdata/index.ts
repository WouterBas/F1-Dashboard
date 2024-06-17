import { Hono } from "hono";
import { getTimingDataByMinute } from "./controller";
import { keyValidator } from "../../middleware";

const timingDataRouter = new Hono();

timingDataRouter.get("/:key", keyValidator, getTimingDataByMinute);

export default timingDataRouter;
