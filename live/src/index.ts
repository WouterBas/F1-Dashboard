import { Hono } from "hono";
import { SSEStreamingApi } from "hono/streaming";
import { EventEmitter } from "events";

const socket = new WebSocket("ws://localhost:8000/ws");
const eventEmitter = new EventEmitter();

// message is received
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data).M;
  if (message) {
    eventEmitter.emit("update", {
      type: message[0].A[0],
      date: message[0].A[2],
    });
  }
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

  eventEmitter.on("update", (data) => {
    counter++;
    stream.writeSSE({
      id: counter.toString(),
      event: "update",
      data: JSON.stringify(data),
    });
  });

  return c.newResponse(stream.responseReadable);
});

export default app;
