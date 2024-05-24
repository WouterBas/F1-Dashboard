import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import {
  circuitRouter,
  scheduleRouter,
  positionRouter,
  sessionRouter,
} from "./modules";

const app = new Hono().basePath("/api/v1");
app.use(logger());
app.use(cors());

app.get("/status", async (c) => {
  return c.text("server is running");
});

app.route("/circuit", circuitRouter);
app.route("/position", positionRouter);
app.route("/session", sessionRouter);
app.route("/schedule", scheduleRouter);

export default app;
