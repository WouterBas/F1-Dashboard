import { Hono } from "hono";
import { getTrackstatusByKey } from "./controller";

const trackstatusRouter = new Hono();

trackstatusRouter.get("/:key", getTrackstatusByKey);

export default trackstatusRouter;
