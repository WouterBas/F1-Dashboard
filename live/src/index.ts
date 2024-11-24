import { EventEmitter } from "events";
import { connectF1 } from "./f1-webhook";

let initialState = {};

let counter = 0;

const emitter = new EventEmitter();

emitter.on("update", (data) => {
  if (data.R) {
    initialState = data.R;
  }
});

await connectF1(emitter);

function sendSSEMessage(
  controller: ReadableStreamDefaultController,
  data: string | object
) {
  controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
}

function sse(req: Request) {
  const { signal } = req;
  return new Response(
    new ReadableStream({
      start(controller) {
        counter++;
        console.log("Client connected", counter);

        // Send initial state immediately
        sendSSEMessage(controller, initialState);

        // const interval = setInterval(() => {
        //   sendSSEMessage(controller, initialState);
        // }, 1000);

        signal.onabort = () => {
          counter--;
          console.log("Client disconnected", counter);
          // clearInterval(interval);
          controller.close();
        };
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}

Bun.serve({
  idleTimeout: 120,
  fetch(req) {
    if (new URL(req.url).pathname === "/sse") {
      return sse(req);
    }
    return new Response("Not Found", { status: 404 });
  },
});
