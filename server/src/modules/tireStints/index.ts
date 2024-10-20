import { Hono } from "hono";
import { getTireStints } from "./controller";
import { keyValidator } from "../../middleware";

const tireStintsRouter = new Hono();

tireStintsRouter.get("/:key", keyValidator, getTireStints);

export default tireStintsRouter;
