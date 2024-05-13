import { Hono } from "hono";
import { getPositionOneDriver, getPositionByKey } from "./controller";

const positionRouter = new Hono();

positionRouter.get("/:key", getPositionByKey);
positionRouter.get(":driver/:key", getPositionOneDriver);

export default positionRouter;
