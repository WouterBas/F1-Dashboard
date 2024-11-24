import { sleep } from "bun";
import { EventEmitter } from "events";

export async function connectSim(emitter: EventEmitter) {
  const socket = new WebSocket("ws://localhost:8000/ws");

  // message is received
  socket.addEventListener("message", (event) => {
    try {
      emitter.emit("update", JSON.parse(event.data));
    } catch (error) {
      console.log(error);
    }
  });

  // socket opened
  socket.addEventListener("open", (event) => {
    console.log("Socket opened");
  });

  // socket closed
  socket.addEventListener("close", (event) => {
    sleep(100).then(() => {
      connectSim(emitter);
    });
  });

  // error handler
  socket.addEventListener("error", (event) => {
    console.log("Socket error");
  });
}
