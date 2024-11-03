import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

const sseRouter = new Hono();
let id = 0;

sseRouter.get("/", async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `It is ${new Date().toISOString()}`;
      await stream.writeSSE({
        data: message,
        event: "time-update",
        id: String(id++),
      });
      await stream.sleep(1000);
    }
  });
});

export default sseRouter;
