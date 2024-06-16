import { Hono } from "hono";
import { test } from "./controller";

const scheduleRouter = new Hono();

scheduleRouter.get("/", test);

export default scheduleRouter;
