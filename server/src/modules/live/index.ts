import { Hono } from "hono";
import { SSEStreamingApi } from "hono/streaming";

const sseRouter = new Hono();
let counter = 0;

sseRouter.get("/", async (c) => {
  const { readable, writable } = new TransformStream();
  const stream = new SSEStreamingApi(writable, readable);

  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  counter++;
  setInterval(() => {
    stream.writeSSE({
      id: counter.toString(),
      event: "message",
      data: "Hello, world! Current time is: " + new Date().toLocaleTimeString(),
    });
  }, 1000);

  return c.newResponse(stream.responseReadable);
});

export default sseRouter;
