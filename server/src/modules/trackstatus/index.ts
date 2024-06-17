import { Hono } from "hono";
import { getTrackstatusByKey } from "./controller";
import { keyValidator } from "../../middleware";

const trackstatusRouter = new Hono();

trackstatusRouter.get("/:key", keyValidator, getTrackstatusByKey);

export default trackstatusRouter;
