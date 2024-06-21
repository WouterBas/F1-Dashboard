import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import {
  circuitRouter,
  positionRouter,
  sessionRouter,
  timingDataRouter,
  authRouter,
  trackstatusRouter,
} from "./modules";

export const app = new Hono().basePath("/api/v1");
app.use(logger());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    allowMethods: ["POST", "GET", "PATCH"],
    credentials: true,
  })
);

app.get("/status", async (c) => {
  return c.text("server is running");
});

app.get("/doc", async (c) => {
  return c.redirect(
    "https://documenter.getpostman.com/view/33579344/2sA3XSA1Vc"
  );
});

app.route("/circuit", circuitRouter);
app.route("/position", positionRouter);
app.route("/session", sessionRouter);
app.route("/timingdata", timingDataRouter);
app.route("/auth", authRouter);
app.route("/trackstatus", trackstatusRouter);

export default app;
