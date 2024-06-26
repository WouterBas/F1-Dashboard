"use client";
import { CircuitList } from "@/types";
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
import NumberInput from "./NumberInput";

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
    angle,
  } = useAdminStore();
  const [newCircuits, setNewCircuits] = useState<CircuitList[]>(circuitList);
  const [aspectRatio, setAspectRatio] = useState<number>(1);

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
  } = useSWR<{ x: number; y: number }[]>(
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

  if (error !== undefined) {
    console.log(error);
  }

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0) {
      drawCircuit(
        circuitRef,
        circuitPoints,
        width,
        dpr,
        scale,
        angle,
        closed,
        points,
      );
    }
    if (circuitRef.current) {
      const aspect = circuitRef.current?.width / circuitRef.current?.height;
      setAspectRatio(aspect);
    }
  }, [
    circuitPoints,
    circuitRef,
    width,
    dpr,
    scale,
    closed,
    angle,
    points,
    error,
  ]);

  return (
    <div className="grid grid-rows-[auto,1fr] gap-1 sm:gap-2  lg:gap-3">
      <div className=" grid gap-1 text-sm  sm:grid-cols-[auto,1fr] sm:gap-2 sm:text-base">
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
          <NumberInput />
          <div className="flex gap-1 sm:gap-2">
            <Button value={closed} label="Close" setValue={setClosed} />
            <Button value={points} label="Points" setValue={setPoints} />
          </div>
        </div>

        <button
          className="h-fit w-full self-center justify-self-end rounded border-2 bg-neutral-800 px-3 py-1 text-center text-base disabled:opacity-50 sm:w-fit"
          disabled={saved || error}
          onClick={() =>
            trigger({
              sessionKey: selected.sessionKey,
              driverKey: selected.driverKey,
              startTime: startTime,
              duration: duration,
              circuitPoints: error ? [] : circuitPoints,
              angle: angle,
              aspectRatio: aspectRatio,
            })
          }
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <div className="relative h-full rounded-md bg-neutral-800  sm:max-h-[calc(100dvh-64px)] md:max-h-[calc(100dvh-78px)]  lg:max-h-[calc(100dvh-98px)]">
        <div className="grid h-full items-center" ref={mapRef}>
          <div className="absolute left-4 top-4 z-10">
            {isLoading && <FaSpinner className="animate-spin text-2xl" />}
            {error && <p>No circuit points found</p>}
          </div>

          <canvas
            className={`${error ? "hidden" : "block"} mx-auto max-h-[calc(100dvh-264px)] max-w-full  sm:max-h-[calc(100dvh-232px)] md:max-h-[calc(100dvh-210px)] lg:max-h-[calc(100dvh-176px)]`}
            ref={circuitRef}
          ></canvas>
        </div>
      </div>
    </div>
  );
};
export default CreateCircuitForm;
