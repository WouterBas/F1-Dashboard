"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import { CircuitInfo, CircuitList, CircuitPoints } from "@/types";
import { RefObject, useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaSpinner,
  FaRegSquare,
  FaRegSquareCheck,
} from "react-icons/fa6";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import useSWRMutation from "swr/mutation";
import { apiService } from "@/services/api.service";
import { HTTPError } from "ky";

const CreateCircuit = () => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [close, setClose] = useState<boolean>(false);
  const [drawPoints, setDrawPoints] = useState<boolean>(true);
  const [startTime, setStartTime] = useState<Date>();
  const [duration, setDuration] = useState<number>(60000);
  const [selectedDriver, setSelectedDriver] = useState<number>();
  const [selectedCircuit, setSelectedCircuit] = useState<string>();
  const [circuitSaved, setCircuitSaved] = useState<boolean>(true);
  const [width, setWidth] = useState<number>(0);
  const [dpr, setDpr] = useState<number>(1);

  // load circuit list
  const { data: circuitList, isLoading: circuitListLoading } = useSWR<
    CircuitList[]
  >("circuit/all", fetcher);

  // set dpr
  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  // set default circuit
  useEffect(() => {
    if (circuitList) {
      setSelectedCircuit(circuitList[0]._id);
    }
  }, [circuitList]);

  // load circuit info
  const { data: circuitInfo, isLoading: circuitInfoLoading } = useSWR<
    CircuitInfo,
    HTTPError
  >(selectedCircuit ? `circuit/info/${selectedCircuit}` : null, fetcher);

  // set default driver, start time and duration
  useEffect(() => {
    if (circuitInfo) {
      setSelectedDriver(
        circuitInfo.selectedDriver
          ? circuitInfo.selectedDriver
          : circuitInfo.sessionInfo.drivers[0].racingNumber,
      );
      setStartTime(
        circuitInfo.startTime
          ? new Date(circuitInfo.startTime)
          : new Date(circuitInfo.sessionInfo.startDate),
      );
      setDuration(circuitInfo.duration ? circuitInfo.duration : 60000);
    }
  }, [circuitInfo]);

  // load circuit points
  const { data: circuitPoints, isLoading: circuitPointsLoading } = useSWR<
    CircuitPoints[]
  >(
    selectedCircuit && startTime && duration && selectedDriver
      ? `position/${selectedDriver}/${circuitInfo?.sessionInfo.sessionKey}?starttime=${startTime?.toISOString()}&duration=${duration}`
      : null,
    fetcher,
  );

  // set width
  useEffect(() => {
    window.addEventListener("resize", () => {
      mainRef.current && setWidth(mainRef.current.clientWidth);
    });
    mainRef.current && setWidth(mainRef.current.clientWidth);
  }, [circuitRef]);

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints?.length > 0) {
      drawCircuit(circuitRef, circuitPoints, close, drawPoints, width, dpr);
    }
  }, [circuitPoints, close, drawPoints, width, dpr]);

  // save circuit
  const { trigger } = useSWRMutation(`circuit/${circuitInfo?._id}`, (url) => {
    apiService
      .patch(url, {
        json: {
          circuitPoints,
          selectedDriver,
          startTime,
          duration,
        },
        credentials: "include",
      })
      .then((res) => res.ok && setCircuitSaved(true));
  });

  // get formatted time
  function getFormattedTime(duration: number): string {
    const minutes = Math.floor(duration / 60 / 1000);
    const remainingSeconds = (duration % (60 * 1000)) / 1000;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1.5 py-1.5">
          <label htmlFor="circuit">Circuit:</label>

          <div
            className={`${(!circuitList || circuitListLoading) && "animate-pulse rounded bg-neutral-600 "} relative h-7 w-52`}
          >
            {circuitList && (
              <>
                <select
                  id="circuit"
                  value={selectedCircuit}
                  onChange={(e) => {
                    setSelectedCircuit(e.target.value);
                  }}
                  className="block w-full appearance-none rounded border-2 border-neutral-700 bg-neutral-700 px-2  pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
                >
                  {circuitList.map((circuit) => (
                    <option key={circuit._id} value={circuit._id}>
                      {circuit.name}
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
            className={`${(!circuitInfo || circuitInfoLoading) && "animate-pulse rounded bg-neutral-600 "} relative h-7 w-20`}
          >
            {circuitInfo && (
              <>
                <select
                  id="driver"
                  value={selectedDriver}
                  onChange={(e) => {
                    setCircuitSaved(false);
                    setSelectedDriver(parseInt(e.target.value));
                  }}
                  className="block w-full appearance-none rounded border-2 border-neutral-700 bg-neutral-700 px-2  pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
                >
                  {circuitInfo.sessionInfo.drivers.map((driver) => (
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
          {!startTime || circuitInfoLoading ? (
            <div className="h-[30px] w-[91px] animate-pulse rounded-md bg-neutral-600"></div>
          ) : (
            <input
              className="rounded border-2 border-neutral-800 bg-neutral-800 px-0.5 text-center -indent-[1px] text-white focus:border-neutral-500 focus:outline-none"
              id="startTime"
              type="time"
              step="1"
              name="startTime"
              value={new Date(startTime).toTimeString().split(" ")[0]}
              onChange={(e) => {
                setCircuitSaved(false);
                const day = new Date(startTime).toISOString().split("T")[0];
                setStartTime(new Date(`${day}T${e.target.value}.000`));
              }}
            />
          )}
        </div>
        <div className="flex h-10 items-center rounded-md bg-neutral-800 px-1.5">
          <label htmlFor="duration">Duration:</label>
          {!startTime || circuitInfoLoading ? (
            <div className="h-[30px] w-[60px] animate-pulse rounded-md bg-neutral-600"></div>
          ) : (
            <input
              className="rounded border-2 border-neutral-800 bg-neutral-800 px-0.5 text-center -indent-[1px] text-white focus:border-neutral-500 focus:outline-none"
              id="duration"
              type="time"
              name="duration"
              value={getFormattedTime(duration)}
              onChange={(e) => {
                setCircuitSaved(false);
                const milliSeconds: number =
                  e.target.value.split(":").reduce((a, b) => a * 60 + +b, 0) *
                  1000;
                if (milliSeconds < 180000) {
                  setDuration(milliSeconds);
                }
              }}
            />
          )}
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
          className={` ml-auto flex h-10 items-center rounded-md border-2 bg-neutral-800 px-3 disabled:opacity-50`}
          disabled={circuitSaved}
          onClick={() => trigger()}
        >
          {circuitSaved ? "Saved" : "Save"}
        </button>
      </div>
      <main
        className="relative rounded-lg bg-neutral-800 p-2 sm:p-3 md:p-4"
        ref={mainRef}
      >
        {(!circuitPoints || circuitPointsLoading) && (
          <FaSpinner className="absolute left-4 top-4 animate-spin text-2xl" />
        )}
        {circuitPoints && circuitPoints.length === 0 ? (
          <p>No circuit data found</p>
        ) : (
          <div className="relative mx-auto w-full max-w-fit">
            <canvas
              className="mx-auto max-h-[calc(100dvh-172px)] max-w-full"
              ref={circuitRef}
            ></canvas>
          </div>
        )}
      </main>
    </>
  );
};
export default CreateCircuit;
