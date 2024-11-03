import { Hono } from "hono";
import { getTimingData } from "./controller";
import { validateKeyMinute } from "../shared/validation.middleware";

const timingDataRouter = new Hono();

timingDataRouter.get("/:key", validateKeyMinute, getTimingData);

export default timingDataRouter;
