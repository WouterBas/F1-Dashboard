"use client";
import { CircuitList, CircuitPoints } from "@/types";
import Dropdown from "@/components/admin/Dropdown";
import { useAdminStore } from "@/store/adminStore";
import useSWR from "swr";
import fetcher, { sendRequest } from "@/utils/fetcher";
import Button from "@/components/admin/Button";
import TimeInput from "@/components/admin/TimeInput";
import { FaSpinner } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";
import { RefObject, useEffect, useRef, useState } from "react";
import { drawCircuit } from "@/utils/drawCircuit";

const CreateCircuitForm = ({ circuitList }: { circuitList: CircuitList[] }) => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [dpr, setDpr] = useState<number>(3);
  const [scale, setScale] = useState<number>(1);
  const {
    selected,
    closed,
    points,
    setClosed,
    setPoints,
    duration,
    startTime,
    saved,
    setSaved,
  } = useAdminStore();
  const [newCircuits, setNewCircuits] = useState<CircuitList[]>(circuitList);

  // set dpr
  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  // set width
  useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    onResize();
  }, []);

  function onResize() {
    mapRef.current && setWidth(mapRef.current.clientWidth);
    const width = window.innerWidth;
    let deviceScale = 3;
    if (width < 640) {
      deviceScale = 1.25;
    } else if (width < 768) {
      deviceScale = 2;
    } else if (width < 1024) {
      deviceScale = 2.5;
    } else {
      deviceScale = 3;
    }
    setScale(deviceScale);
  }

  // save circuit
  const { trigger, data } = useSWRMutation(
    `circuit/${selected.circuitKey}`,
    sendRequest,
    {
      onSuccess: () => {
        setSaved(true);
      },
    },
  );
  // update circuit list data after saving
  useEffect(() => {
    data && setNewCircuits(data as CircuitList[]);
  }, [data]);

  const availableCircuits = newCircuits.map((circuit) => ({
    name: circuit.name,
    value: circuit.circuitKey,
  }));

  const availableSessions = newCircuits
    .filter((circuit) => circuit.circuitKey === selected.circuitKey)
    .map((circuit) => circuit.sessions)
    .flat()
    .map((session) => ({
      name: new Date(session.startDate).getFullYear() + " - " + session.type,
      value: session.sessionKey,
    }));

  const sessionIndex = availableSessions.findIndex(
    (session) => session.value === selected.sessionKey,
  );

  const availableDrivers = newCircuits
    .filter((circuit) => circuit.circuitKey === selected.circuitKey)
    .map((circuit) => circuit.sessions)
    .flat()
    [sessionIndex].drivers.map((driver) => ({
      name: driver.abbreviation,
      value: driver.racingNumber,
    }));

  // get circuit points
  const {
    data: circuitPoints,
    isLoading,
    error,
  } = useSWR<CircuitPoints[]>(
    `position/${selected.driverKey}/${selected.sessionKey}?starttime=${startTime?.toISOString()}&duration=${duration}`,
    fetcher,
    {
      keepPreviousData: true,
      errorRetryCount: 0,
    },
  );

  // get formatted time
  function getFormattedTime(duration: number): string {
    const minutes = Math.floor(duration / 60 / 1000);
    const remainingSeconds = (duration % (60 * 1000)) / 1000;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0) {
      drawCircuit(circuitRef, circuitPoints, width, dpr, scale, closed, points);
    }
  }, [circuitPoints, circuitRef, width, dpr, scale, closed, points]);

  return (
    <main className="col-span-2">
      <div className="mb-1 grid gap-1 text-sm sm:mb-2 sm:grid-cols-[auto,1fr] sm:gap-2 sm:text-base">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Dropdown
            options={availableCircuits}
            value="circuitKey"
            label="Circuit"
            circuitList={newCircuits}
          />
          <Dropdown
            options={availableSessions}
            value="sessionKey"
            label="Session"
            circuitList={newCircuits}
          />

          <Dropdown
            options={availableDrivers}
            value="driverKey"
            label="Driver"
          />

          <TimeInput
            value={new Date(startTime).toTimeString().split(" ")[0]}
            label="Start Time"
            step={1}
          />
          <TimeInput
            value={getFormattedTime(duration)}
            label="Duration"
            step={60}
          />
          <div className="flex gap-1 sm:gap-2">
            <Button value={closed} label="Close" setValue={setClosed} />
            <Button value={points} label="Points" setValue={setPoints} />
          </div>
        </div>

        <button
          className="h-fit w-full self-center justify-self-end rounded border-2 bg-neutral-800 px-3 py-1 text-center text-base disabled:opacity-50 sm:w-fit"
          disabled={saved}
          onClick={() =>
            trigger({
              sessionKey: selected.sessionKey,
              driverKey: selected.driverKey,
              startTime: startTime,
              duration: duration,
              circuitPoints: circuitPoints,
            })
          }
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <div className="relative max-h-[calc(100dvh-46px)] rounded-md bg-neutral-800 p-1 sm:max-h-[calc(100dvh-64px)] sm:p-2 md:max-h-[calc(100dvh-78px)] md:p-3 lg:max-h-[calc(100dvh-98px)]">
        <div className="relative" ref={mapRef}>
          <div className="absolute left-4 top-4 z-10">
            {isLoading && <FaSpinner className="animate-spin text-2xl" />}
            {error && <p>No circuit points found</p>}
          </div>

          <canvas
            className="max-h-[calc(100dvh-242px)] max-w-full sm:max-h-[calc(100dvh-252px)] md:max-h-[calc(100dvh-232px)] lg:max-h-[calc(100dvh-200px)]  2xl:max-h-[calc(100dvh-156px)]"
            ref={circuitRef}
          ></canvas>
        </div>
      </div>
    </main>
  );
};
export default CreateCircuitForm;
