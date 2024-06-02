import { Hono } from "hono";
import { getPositionOneDriver, getPositionByMinute } from "./controller";

const positionRouter = new Hono();

positionRouter.get("/:key", getPositionByMinute);
positionRouter.get(":driver/:key", getPositionOneDriver);

export default positionRouter;
