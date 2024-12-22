import { EventEmitter } from "events";
import { connectF1 } from "./f1-webhook";
import { connectSim } from "./simulator";
import merge from "lodash/merge";
import zlib from "zlib";

let state = {};

let counter = 0;

const emitter = new EventEmitter();

emitter.on("update", (data) => {
  if (data.R) {
    const newObject = {};
    delete Object.assign(newObject, data.R, {
      ["Position"]: data.R["Position.z"],
    })["Position.z"];

    state = merge(newObject, {
      ExtrapolatedClock: {
        ...data.R.ExtrapolatedClock,
        serverTime: new Date(),
      },
    });
  }
  if (data.M) {
    data.M.forEach((m: any) => {
      let [path, dataUpdate] = m.A;

      if (path === "Position.z") {
        const decodedData = Buffer.from(dataUpdate, "base64");
        const uint8Array = new Uint8Array(decodedData);
        const decompressedData = zlib.inflateRawSync(uint8Array);
        const jsonData = JSON.parse(
          decompressedData.toString("utf-8")
        ).Position;

        path = "Position";
        dataUpdate = jsonData[jsonData.length - 1];
      }

      if (path === "ExtrapolatedClock") {
        dataUpdate = {
          ...dataUpdate,
          serverTime: new Date(),
        };
      }

      broadcastMessage([path, dataUpdate]);

      merge(state[path as keyof typeof state], dataUpdate);
    });
  }
});

await connectF1(emitter);
// await connectSim(emitter);

// Store active SSE clients
const sseClients: Set<ReadableStreamDefaultController<any>> = new Set();

// Function to broadcast WebSocket messages to all SSE clients
function broadcastMessage(message: any) {
  sseClients.forEach((controller) => {
    try {
      controller.enqueue(`event: update\ndata: ${JSON.stringify(message)}\n\n`);
    } catch {
      sseClients.delete(controller); // Clean up broken streams
    }
  });
}

function sse(req: Request) {
  const { signal } = req;
  return new Response(
    new ReadableStream({
      start(controller) {
        counter++;
        console.log("Client connected", counter);

        // Send initial full data
        controller.enqueue(`event: init\ndata: ${JSON.stringify(state)}\n\n`);

        // Add the client to active SSE clients
        sseClients.add(controller);

        signal.onabort = () => {
          counter--;
          console.log("Client disconnected", counter);
          sseClients.delete(controller);
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
