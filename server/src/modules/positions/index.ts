import { Hono } from "hono";
import { getPositionOneDriver, getPositionByMinute } from "./controller";
import { validatePositionOneDriver } from "./validation.middleware";
import { validateKeyMinute } from "../shared/validation.middleware";

const positionRouter = new Hono();

positionRouter.get("/:key", validateKeyMinute, getPositionByMinute);
positionRouter.get(
  ":driver/:key",
  validatePositionOneDriver,
  getPositionOneDriver
);

export default positionRouter;
