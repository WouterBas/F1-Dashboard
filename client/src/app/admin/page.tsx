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
import { useQuery } from "@tanstack/react-query";

const Admin = () => {
  const ref: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  const [close, setClose] = useState<boolean>(false);
  const [drawPoints, setDrawPoints] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<Date>();
  const [duration, setDuration] = useState<number>(60000);
  const [selectedDriver, setSelectedDriver] = useState<number>();

  const circuitList = useQuery({
    queryKey: ["circuitList"],
    queryFn: async () => {
      const response = await apiService.get("circuit/all");
      const data: string[] = await response.json();
      return data;
    },
  });

  const sessionInfo = useQuery({
    queryKey: ["driverList"],
    queryFn: async () => {
      const response = await apiService.get("session/9488");
      const data: SessionGp = await response.json();
      setSelectedDriver(data.drivers[0].racingNumber);
      setStartTime(new Date(data.startDate));
      return data;
    },
  });

  const circuitPoints = useQuery({
    queryKey: ["circuitPoints", startTime, duration, selectedDriver],
    queryFn: async () => {
      const response = await apiService.get(
        `position/${selectedDriver}/9488?starttime=${startTime?.toISOString()}&duration=${duration}`,
      );
      const data: CircuitPoints[] = await response.json();
      return data;
    },
    enabled: !!startTime,
  });

  useEffect(() => {
    if (circuitPoints.isSuccess) {
      drawCircuit(ref, circuitPoints.data, close, drawPoints);
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
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1.5 py-1.5">
          <label htmlFor="circuit">Circuit:</label>

          <div
            className={`${circuitList.isLoading && "animate-pulse rounded bg-neutral-600 "} relative h-7 w-52`}
          >
            {circuitList.data && (
              <>
                <select
                  id="circuit"
                  className="block w-full appearance-none rounded border-2 border-neutral-700 bg-neutral-700 px-2  pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
                >
                  {circuitList.data.map((circuit) => (
                    <option key={circuit} value={circuit}>
                      {circuit}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="pointer-events-none absolute right-2 top-1.5" />
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1.5 py-1.5">
          <label htmlFor="driver">Driver:</label>
          <div
            className={`${sessionInfo.isLoading && "animate-pulse rounded bg-neutral-600 "} relative h-7 w-20`}
          >
            {sessionInfo.data && (
              <>
                <select
                  id="driver"
                  onChange={(e) => {
                    setSelectedDriver(parseInt(e.target.value));
                  }}
                  className="block w-full appearance-none rounded border-2 border-neutral-700 bg-neutral-700 px-2  pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
                >
                  {sessionInfo.data.drivers.map((driver) => (
                    <option
                      key={driver.racingNumber}
                      value={driver.racingNumber}
                    >
                      {driver.abbreviation}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="pointer-events-none absolute right-2 top-1.5" />
              </>
            )}
          </div>
        </div>
        <div className="flex h-10 items-center rounded-md bg-neutral-800 px-1.5">
          <label htmlFor="startTime">Start Time:</label>
          {!sessionInfo.isSuccess ? (
            <div className="h-[30px] w-[91px] animate-pulse rounded-md bg-neutral-600"></div>
          ) : (
            <input
              className="rounded border-2 border-neutral-800 bg-neutral-800 px-0.5 text-center text-white focus:border-neutral-500 focus:outline-none"
              id="startTime"
              type="time"
              step="1"
              name="startTime"
              defaultValue={
                new Date(sessionInfo.data.startDate)
                  .toTimeString()
                  .split(" ")[0]
              }
              onChange={(e) => {
                setStartTime(new Date("2024-03-24T" + e.target.value + ".000"));
              }}
            />
          )}
        </div>
        <div className="flex h-10 items-center rounded-md bg-neutral-800 px-1.5">
          <label htmlFor="duration">Duration:</label>
          <input
            className="rounded border-2 border-neutral-800 bg-neutral-800 px-0.5 text-center text-white focus:border-neutral-500 focus:outline-none"
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
        <div className="flex h-10 items-center rounded-md bg-neutral-800 px-1.5">
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
        <div className="flex h-10 items-center rounded-md bg-neutral-800 px-1.5">
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
          className="ml-auto flex h-10 items-center rounded-md border-2 bg-neutral-800 px-3"
          onClick={() => save()}
        >
          Save
        </button>
      </div>
      <main className="relative rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
        {!circuitPoints.isSuccess && (
          <FaSpinner className="absolute left-4 top-4 animate-spin text-2xl" />
        )}
        <div className="relative mx-auto w-fit ">
          <canvas
            className="mx-auto max-h-[calc(100dvh-170px)] w-full"
            ref={ref}
          ></canvas>
        </div>
      </main>
    </>
  );
};
export default Admin;
