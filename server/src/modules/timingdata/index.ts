import { Hono } from "hono";
import { getTimingDataByMinute } from "./controller";

const timingDataRouter = new Hono();

timingDataRouter.get("/:key", getTimingDataByMinute);

export default timingDataRouter;
