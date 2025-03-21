"use client";
import { CircuitList } from "@/types";
import Dropdown from "@/components/admin/Dropdown";
import useSWR from "swr";
import fetcher, { sendRequest } from "@/utils/fetcher";
import Button from "@/components/admin/Button";
import TimeInput from "@/components/admin/TimeInput";
import { FaChevronDown, FaSpinner } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";
import {
  ChangeEvent,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { drawCircuit } from "@/utils/drawCircuit";
import NumberInput from "./NumberInput";
import useResize from "@/hooks/useResize";

const CreateCircuitForm = ({ circuitList }: { circuitList: CircuitList[] }) => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { width, dpr, scale } = useResize({ mapRef });

  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [circuitKey, setCircuitKey] = useState<number>(9);
  const [sessionKey, setSessionKey] = useState<number>(
    circuitList[0].sessionKey || 9213,
  );
  const [driverNumber, setDriverNumber] = useState<number>(
    circuitList[0].driverKey || 1,
  );
  const [angle, setAngle] = useState<number>(circuitList[0].angle || 0);
  const [duration, setDuration] = useState<number>(
    circuitList[0].duration || 60000,
  );
  const [startTime, setStartTime] = useState<Date>(
    new Date(circuitList[0].startTime || new Date()),
  );

  const [drawPoints, setDrawPoints] = useState<boolean>(false);
  const [closed, setClosed] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(true);

  const [mode, setMode] = useState<string>("draw");

  const [finishAngle, setFinishAngle] = useState<number>(
    circuitList[0].finishAngle || 0,
  );
  const [pointNumber, setPointNumber] = useState<number>(
    circuitList[0].finishPoint || 0,
  );

  const [pitTime, setPitTime] = useState<Date>(
    new Date(
      circuitList[0].pitTime ||
        new Date(circuitList[0].startTime || new Date()),
    ),
  );
  const [pitDuration, setPitDuration] = useState<number>(
    circuitList[0].pitDuration || 10000,
  );

  const modeOptions = [
    { name: "Draw", value: "draw" },
    { name: "Finish", value: "finish" },
    { name: "Pit", value: "pit" },
  ];

  // all circuit options
  const circuitKeyOptions = useMemo(
    () =>
      circuitList.map((circuit) => ({
        name: circuit.name,
        value: circuit.circuitKey,
      })),
    [circuitList],
  );

  // all session options for selected circuit
  const sessionKeyOptions = useMemo(() => {
    const sessions = circuitList
      .find((circuit) => circuit.circuitKey === circuitKey)
      ?.sessions.map((session) => ({
        name: `${new Date(session.startDate).getFullYear()} ${session.type}`,
        value: session.sessionKey,
      }));
    return sessions;
  }, [circuitKey, circuitList]);

  // all driver options for selected session
  const driverNumberOptions = useMemo(() => {
    const drivers = circuitList
      .find((circuit) => circuit.circuitKey === circuitKey)
      ?.sessions.find((session) => session.sessionKey === sessionKey)
      ?.drivers.map((driver) => ({
        name: driver.abbreviation,
        value: driver.racingNumber,
      }));
    return drivers;
  }, [circuitKey, sessionKey, circuitList]);

  // set default values on circuit change
  const onCircuitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCircuitKey(Number(e.target.value));
    const circuit = circuitList.find(
      (circuit) => circuit.circuitKey === Number(e.target.value),
    );

    if (circuit) {
      setSessionKey(circuit.sessionKey || circuit.sessions[0].sessionKey);
      setDriverNumber(
        circuit.driverKey || circuit.sessions[0].drivers[0].racingNumber,
      );
      setStartTime(
        new Date(circuit?.startTime || circuit?.sessions[0].startDate),
      );
      setDuration(circuit.duration || 60000);
      setAngle(circuit.angle || 0);
      setFinishAngle(circuit.finishAngle || 0);
      setPointNumber(circuit.finishPoint || 0);
      setPitTime(
        new Date(circuit?.pitTime || circuit?.startTime || new Date()),
      );
      setPitDuration(circuit.pitDuration || 10000);
    }
  };

  const onSessionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSessionKey(Number(e.target.value));
    setSaved(false);
    const circuit = circuitList.find(
      (circuit) => circuit.circuitKey === circuitKey,
    );
    const session = circuit?.sessions.find(
      (session) => session.sessionKey === Number(e.target.value),
    );

    if (session && circuit) {
      setDriverNumber(circuit.driverKey || session?.drivers[0].racingNumber);
      setStartTime(new Date(session?.startDate));
      setDuration(circuit.duration || 60000);
      setPitTime(
        new Date(circuit?.pitTime || session?.startDate || new Date()),
      );
      setPitDuration(circuit.pitDuration || 10000);
    }
  };

  const onDriverChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDriverNumber(Number(e.target.value));
    setSaved(false);
  };

  // save circuit
  const { trigger } = useSWRMutation(`circuit/${circuitKey}`, sendRequest, {
    onSuccess: () => {
      setSaved(true);
    },
  });

  // get circuit points
  const {
    data: circuitPoints,
    isLoading: isLoadingCircuit,
    error: errorCircuit,
  } = useSWR<{ x: number; y: number }[]>(
    `position/${driverNumber}/${sessionKey}?starttime=${startTime.toISOString()}&duration=${duration}`,
    fetcher,
  );

  // get pit lane points
  const {
    data: pitPoints,
    isLoading: isLoadingPit,
    error: errorPit,
  } = useSWR<{ x: number; y: number }[]>(
    `position/${driverNumber}/${sessionKey}?starttime=${pitTime.toISOString()}&duration=${pitDuration}`,
    fetcher,
  );

  // get formatted time
  function getFormattedTime(duration: number): string {
    const minutes = Math.floor(duration / 60 / 1000);
    const remainingSeconds = (duration % (60 * 1000)) / 1000;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  if (errorCircuit !== undefined || errorPit !== undefined) {
    console.log(errorCircuit, errorPit);
  }

  // draw circuit
  useEffect(() => {
    if (
      circuitPoints &&
      circuitPoints.length > 0 &&
      pitPoints &&
      pitPoints.length > 0
    ) {
      drawCircuit(
        circuitRef,
        circuitPoints,
        width,
        dpr,
        scale,
        angle,
        finishAngle,
        circuitPoints[pointNumber],
        pitPoints,
        closed,
        drawPoints,
      );
    }
    if (circuitRef.current) {
      const aspect = circuitRef.current?.width / circuitRef.current?.height;
      setAspectRatio(aspect);
    }
  }, [
    angle,
    circuitPoints,
    closed,
    dpr,
    drawPoints,
    finishAngle,
    pointNumber,
    scale,
    width,
    pitPoints,
  ]);

  return (
    <div className="grid grid-rows-[auto,1fr] gap-1 sm:gap-2  lg:gap-3">
      <div className=" grid gap-1 text-sm  sm:grid-cols-[auto,1fr] sm:gap-2 sm:text-base">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {mode === "draw" && (
            <>
              <Dropdown
                options={circuitKeyOptions}
                onChange={onCircuitChange}
                value={circuitKey}
                id="circuitKey"
                label="Circuit"
              />

              {sessionKeyOptions && (
                <Dropdown
                  options={sessionKeyOptions}
                  onChange={onSessionChange}
                  value={sessionKey}
                  id="sessionKey"
                  label="Session"
                />
              )}
              {driverNumberOptions && (
                <Dropdown
                  options={driverNumberOptions}
                  onChange={onDriverChange}
                  value={driverNumber}
                  id="driverKey"
                  label="Driver"
                />
              )}

              <TimeInput
                value={new Date(startTime).toTimeString().split(" ")[0]}
                label="Start Time"
                step={1}
                startTime={startTime}
                setSaved={setSaved}
                setStartTime={setStartTime}
                setDuration={setDuration}
              />

              <TimeInput
                value={getFormattedTime(duration)}
                label="Duration"
                step={60}
                startTime={startTime}
                setSaved={setSaved}
                setStartTime={setStartTime}
                setDuration={setDuration}
              />
            </>
          )}

          {mode === "pit" && (
            <>
              <TimeInput
                value={new Date(pitTime).toTimeString().split(" ")[0]}
                label="Start Time"
                step={1}
                startTime={pitTime}
                setSaved={setSaved}
                setStartTime={setPitTime}
                setDuration={setPitDuration}
              />

              <TimeInput
                value={getFormattedTime(pitDuration)}
                label="Duration"
                step={60}
                startTime={pitTime}
                setSaved={setSaved}
                setStartTime={setPitTime}
                setDuration={setPitDuration}
              />
            </>
          )}
          {mode === "draw" && (
            <NumberInput
              label="Angle"
              id="angle"
              angle={angle}
              setAngle={setAngle}
              setSaved={setSaved}
            />
          )}

          {mode === "finish" && (
            <>
              <NumberInput
                label="Angle"
                id="finishAngle"
                angle={finishAngle}
                setAngle={setFinishAngle}
                setSaved={setSaved}
              />

              <NumberInput
                label="Point Number"
                id="pointNumber"
                angle={pointNumber}
                setAngle={setPointNumber}
                setSaved={setSaved}
              />
            </>
          )}
          <div className="flex gap-1 sm:gap-2">
            <Button value={closed} label="Close" setValue={setClosed} />
            <Button
              value={drawPoints}
              label="Points"
              setValue={setDrawPoints}
            />
          </div>
        </div>

        <button
          className="h-fit w-full self-center justify-self-end rounded border-2 bg-neutral-800 px-3 py-1 text-center text-base disabled:opacity-50 sm:w-fit"
          disabled={saved || errorCircuit || errorPit}
          onClick={() =>
            trigger({
              sessionKey: sessionKey,
              driverKey: driverNumber,
              startTime: startTime,
              duration: duration,
              circuitPoints: errorCircuit ? [] : circuitPoints,
              angle: angle,
              aspectRatio: aspectRatio,
              finishAngle: finishAngle,
              finishPoint: pointNumber,
              pitPoints: pitPoints,
              pitTime: pitTime,
              pitDuration: pitDuration,
            })
          }
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>
      <div className="relative h-full rounded-md bg-neutral-800  sm:max-h-[calc(100dvh-64px)] md:max-h-[calc(100dvh-78px)]  lg:max-h-[calc(100dvh-98px)]">
        <div className="grid h-full items-center" ref={mapRef}>
          <div className="absolute right-4 top-4 z-10">
            {(isLoadingCircuit || isLoadingPit) && (
              <FaSpinner className="animate-spin text-2xl" />
            )}
            {errorCircuit && <p>No circuit points found</p>}
            {errorPit && <p>No pit lane points found</p>}
          </div>
          <div className="absolute left-2 top-2 flex gap-2 rounded-md bg-neutral-800 px-1 py-1 pl-2">
            <label htmlFor="mode">Mode</label>
            <div className="relative">
              <select
                id="mode"
                onChange={(e) => setMode(e.target.value)}
                value={mode}
                className="block w-full appearance-none rounded border-2 border-neutral-700 bg-neutral-700 px-2  pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
              >
                {modeOptions.map(({ name, value }) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="pointer-events-none absolute right-2 top-1.5" />
            </div>
          </div>

          <canvas
            className={`${errorCircuit || errorPit ? "hidden" : "block"} mx-auto max-h-[calc(100dvh-264px)] max-w-full  sm:max-h-[calc(100dvh-232px)] md:max-h-[calc(100dvh-210px)] lg:max-h-[calc(100dvh-176px)]`}
            ref={circuitRef}
          ></canvas>
        </div>
      </div>
    </div>
  );
};
export default CreateCircuitForm;
