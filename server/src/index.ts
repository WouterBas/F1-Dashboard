#!/usr/bin/env bun

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
  lapCountRouter,
  tireStintsRouter,
  sseRouter,
} from "./modules";

export const app = new Hono().basePath("/api/v1");

if (process.env.NODE_ENV === "development") {
  app.use(logger());
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    allowMethods: ["POST", "GET", "PATCH"],
    credentials: true,
  })
);

console.log("server is running");

app.get("/status", async (c) => {
  return c.text("server is running");
});

app.route("/circuit", circuitRouter);
app.route("/position", positionRouter);
app.route("/session", sessionRouter);
app.route("/timingdata", timingDataRouter);
app.route("/auth", authRouter);
app.route("/trackstatus", trackstatusRouter);
app.route("/lapcount", lapCountRouter);
app.route("/tirestints", tireStintsRouter);
app.route("/live", sseRouter);

export default app;
