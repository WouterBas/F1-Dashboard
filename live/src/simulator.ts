import { EventEmitter } from "events";

const socket = new WebSocket("ws://localhost:8000/ws");
const emitter = new EventEmitter();

// message is received
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data).M;
  if (message) {
    emitter.emit("update", {
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
