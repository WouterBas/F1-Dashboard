import { Hono } from "hono";
import { SSEStreamingApi } from "hono/streaming";

let state = "";

const socket = new WebSocket("ws://localhost:8000/ws");

// message is received
socket.addEventListener("message", (event) => {
  state = event.data;
});

// socket opened
socket.addEventListener("open", (event) => {
  console.log("Socket opened");
});

// socket closed
socket.addEventListener("close", (event) => {
  console.log("Socket closed");
});

// error handler
socket.addEventListener("error", (event) => {
  console.log("Socket error");
});

const app = new Hono();
let counter = 0;

app.get("/", async (c) => {
  const { readable, writable } = new TransformStream();
  const stream = new SSEStreamingApi(writable, readable);

  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");

  setInterval(() => {
    counter++;
    stream.writeSSE({
      id: counter.toString(),
      event: "message",
      data: JSON.stringify(state),
    });
  }, 1000);

  return c.newResponse(stream.responseReadable);
});

export default app;
