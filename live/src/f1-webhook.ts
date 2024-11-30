import { sleep } from "bun";
import { EventEmitter } from "events";

type NegotiationResponse = {
  Url: string;
  ConnectionToken: string;
  ConnectionId: string;
  KeepAliveTimeout: number;
  DisconnectTimeout: number;
  ConnectionTimeout: number;
  TryWebSockets: boolean;
  ProtocolVersion: string;
  TransportConnectTimeout: number;
  LongPollDelay: number;
};

async function negotiate(): Promise<NegotiationResponse> {
  const hub = encodeURIComponent(JSON.stringify([{ name: "Streaming" }]));
  const url = `https://livetiming.formula1.com/signalr/negotiate?connectionData=${hub}&clientProtocol=1.5`;
  const respone = await fetch(url);
  const data = (await respone.json()) as NegotiationResponse;
  return data;
}

export let state: any = {
  Heartbeat: "null",
};

export async function connectF1(emitter: EventEmitter) {
  const { ConnectionToken } = await negotiate();
  const hub = encodeURIComponent(JSON.stringify([{ name: "Streaming" }]));

  const url = `wss://livetiming.formula1.com/signalr/connect?clientProtocol=1.5&transport=webSockets&connectionToken=${ConnectionToken}&connectionData=${hub}`;

  const socket = new WebSocket(url);

  // message is received
  socket.addEventListener("message", (event) => {
    emitter.emit("update", JSON.parse(event.data));
  });

  // socket opened
  socket.addEventListener("open", (event) => {
    console.log("socket opened");
    socket.send(
      JSON.stringify({
        H: "Streaming", // The hub to invoke the method on
        M: "Subscribe", // The method to invoke
        A: [
          [
            "SessionInfo",
            "DriverList",
            "WeatherData",
            "LapCount",
            "TimingData",
            "TyreStintSeries",
            "TrackStatus",
            "ExtrapolatedClock",
            "Position.z",
          ],
        ], // The arguments to pass to the method
        I: 1, // Client side id for the request/response
      })
    );
  });

  // socket closed
  socket.addEventListener("close", (event) => {
    console.log("socket closed");
    connectF1(emitter);
  });

  // error handler
  socket.addEventListener("error", (event) => {
    console.log("socket error");
  });
}
