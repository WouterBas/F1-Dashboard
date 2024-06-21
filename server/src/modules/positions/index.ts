import { Hono } from "hono";
import { getPositionOneDriver, getPositionByMinute } from "./controller";
import {
  validatePosition,
  validatePositionOneDriver,
} from "./validation.middleware";

const positionRouter = new Hono();

positionRouter.get("/:key", validatePosition, getPositionByMinute);
positionRouter.get(
  ":driver/:key",
  validatePositionOneDriver,
  getPositionOneDriver
);

export default positionRouter;
