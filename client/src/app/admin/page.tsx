/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { drawCircuit } from "@/app/helpers/drawCircuit";
import { apiService } from "@/services/api.service";
import { CircuitPoints } from "@/types/defentions";
import { RefObject, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa6";

const Admin = () => {
  const [circuitPoints, setCircuitPoints] = useState<CircuitPoints[]>([]);
  const ref: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [close, setClose] = useState<boolean>(false);
  const [drawPoints, setDrawPoints] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<Date>(
    new Date("2024-03-24T04:05:00.000Z"),
  );
  const [duration, setDuration] = useState<number>(60000);

  useEffect(() => {
    async function getTrackData() {
      setLoading(true);
      const response = await apiService.get(
        `position/1/9488?starttime=${startTime.toISOString()}&duration=${duration}`,
      );

      const data: CircuitPoints[] = await response.json();
      setCircuitPoints(data);
      setLoading(false);
    }
    getTrackData();
  }, [startTime, duration]);

  useEffect(() => {
    if (circuitPoints.length !== 0) {
      drawCircuit(ref, circuitPoints, close, drawPoints);
    }
  }, [circuitPoints, close, drawPoints]);

  const save = async () => {
    const response = await apiService.patch(
      "circuit/660eb9aded09750f5669d884",
      {
        json: circuitPoints,
      },
    );
  };

  return (
    <>
      <div className="flex justify-center gap-2">
        <div className=" rounded-md bg-neutral-800 px-2 py-1">
          <label htmlFor="startTime">Start Time:</label>
          <input
            className="w-[5.5rem] bg-neutral-800 text-center text-white"
            id="startTime"
            type="time"
            step="1"
            name="startTime"
            defaultValue={startTime.toTimeString().split(" ")[0]}
            onChange={(e) => {
              setStartTime(new Date("2024-03-24T" + e.target.value + ".000"));
            }}
          />
        </div>
        <div className="rounded-md bg-neutral-800 px-2 py-1 ">
          <label htmlFor="duration">Duration:</label>
          <input
            className="w-14 bg-neutral-800 text-center text-white"
            id="duration"
            type="time"
            name="duration"
            defaultValue="01:00"
            onChange={(e) => {
              const milliSeconds: number =
                e.target.value.split(":").reduce((a, b) => a * 60 + +b, 0) *
                1000;
              if (milliSeconds < 180000) {
                setDuration(milliSeconds);
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1">
          <label htmlFor="close">Close</label>
          <input
            type="checkbox"
            name="close"
            id="close"
            checked={close}
            onChange={() => setClose(!close)}
          />
        </div>
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1">
          <label htmlFor="points">Points</label>
          <input
            type="checkbox"
            name="points"
            id="points"
            checked={drawPoints}
            onChange={() => setDrawPoints(!drawPoints)}
          />
        </div>
        <button
          className="justify-self-end rounded-md border-2 px-2"
          onClick={() => save()}
        >
          Save
        </button>
      </div>
      <main className="relative rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
        {loading && (
          <FaSpinner className="absolute left-1/2 top-4 animate-spin" />
        )}
        <div className="relative mx-auto w-fit ">
          <canvas
            className=" mx-auto max-h-[calc(100dvh-158px)] w-full"
            ref={ref}
          ></canvas>
        </div>
      </main>
    </>
  );
};
export default Admin;
