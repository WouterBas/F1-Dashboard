import { Hono } from "hono";
import { logger } from "hono/logger";
import { client, getAllSessions, getSession, getPosition } from "./db";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";

const app = new Hono();
app.use(cors());
app.use(logger());

async function main() {
  app.get("/", (c) => {
    return c.text("hello");
  });

  app.get("/sessions", async (c) => {
    const result = await getAllSessions();
    if (!result) return c.notFound();
    return c.json(result);
  });

  app.get("/session/:id", async (c) => {
    const id: number = parseInt(c.req.param("id"));
    const result = await getSession(id);
    return c.json(result);
  });
  app.get("/position/:id", async (c) => {
    const id: number = parseInt(c.req.param("id"));

    const query: string = c.req.query("time")!;
    const time: Date = new Date(query);

    const result = await getPosition(id, time);
    return c.json(result);
  });

  app.use("/static/*", serveStatic({ root: "./" }));
}

main();
export default app;
