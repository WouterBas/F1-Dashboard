/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { drawCircuit } from "@/app/utils/drawCircuit";
import { apiService } from "@/services/api.service";
import {
  Circuit,
  CircuitPoints,
  SessionGp,
  driverList,
} from "@/types/defentions";
import { RefObject, useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaSpinner,
  FaRegSquare,
  FaRegSquareCheck,
} from "react-icons/fa6";

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
  const [circuitList, setCircuitList] = useState<string[]>([]);
  const [driverList, setDriverList] = useState<driverList[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<number>();

  useEffect(() => {
    async function getCircuits() {
      const response = await apiService.get("circuit/all");
      const data: string[] = await response.json();
      setCircuitList(data);
    }
    getCircuits();
  }, []);

  useEffect(() => {
    async function getDrivers() {
      const response = await apiService.get("session/9488");
      const data: SessionGp = await response.json();
      setDriverList(data.drivers);
      setSelectedDriver(data.drivers[0].racingNumber);
    }
    getDrivers();
  }, []);

  useEffect(() => {
    async function getTrackData() {
      setLoading(true);
      if (selectedDriver) {
        const response = await apiService.get(
          `position/${selectedDriver}/9488?starttime=${startTime.toISOString()}&duration=${duration}`,
        );
        const data: CircuitPoints[] = await response.json();
        setCircuitPoints(data);
        setLoading(false);
      }
    }
    getTrackData();
  }, [startTime, duration, selectedDriver]);

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
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1">
          <label htmlFor="circuit">Circuit:</label>
          <div className="relative">
            <select
              id="circuit"
              className="block w-full appearance-none rounded-md border-2 border-neutral-700 bg-neutral-700 px-2 py-1 pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
            >
              {circuitList.map((circuit) => (
                <option key={circuit} value={circuit}>
                  {circuit}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-2 top-2.5" />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-2 py-1">
          <label htmlFor="driver">Driver:</label>
          <div className="relative">
            <select
              id="driver"
              onChange={(e) => {
                setSelectedDriver(parseInt(e.target.value));
              }}
              className="block w-full appearance-none rounded-md border-2 border-neutral-700 bg-neutral-700 px-2 py-1 pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
            >
              {driverList.map((driver) => (
                <option key={driver.racingNumber} value={driver.racingNumber}>
                  {driver.abbreviation}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-2 top-2.5" />
          </div>
        </div>
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
        <div className="rounded-md bg-neutral-800 px-2 py-1">
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
        <div className="rounded-md bg-neutral-800 px-2 py-1">
          <label htmlFor="close" className="flex items-center gap-2">
            {close ? (
              <FaRegSquareCheck className="text-lg" />
            ) : (
              <FaRegSquare className="text-lg" />
            )}
            Close
          </label>
          <input
            hidden
            type="checkbox"
            name="close"
            id="close"
            checked={close}
            onChange={() => setClose(!close)}
          />
        </div>
        <div className=" rounded-md bg-neutral-800 px-2 py-1">
          <label htmlFor="points" className="flex items-center gap-2">
            {drawPoints ? (
              <FaRegSquareCheck className="text-lg" />
            ) : (
              <FaRegSquare className="text-lg" />
            )}
            Points
          </label>
          <input
            hidden
            type="checkbox"
            name="points"
            id="points"
            checked={drawPoints}
            onChange={() => setDrawPoints(!drawPoints)}
          />
        </div>
        <button
          className=" ml-auto rounded-md border-2 bg-neutral-800 px-2 py-1"
          onClick={() => save()}
        >
          Save
        </button>
      </div>
      <main className="relative rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
        {loading && (
          <FaSpinner className="absolute left-1/2 top-4 animate-spin text-2xl" />
        )}
        <div className="relative mx-auto w-fit ">
          <canvas
            className=" mx-auto max-h-[calc(100dvh-162px)] w-full"
            ref={ref}
          ></canvas>
        </div>
      </main>
    </>
  );
};
export default Admin;
