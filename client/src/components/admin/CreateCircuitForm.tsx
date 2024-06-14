"use client";
import { CircuitList, CircuitPoints } from "@/types";
import Dropdown from "@/components/admin/Dropdown";
import { useAdminStore } from "@/store/adminStore";
import useSWR from "swr";
import fetcher, { sendRequest } from "@/utils/fetcher";
import MapCircuitClient from "@/components/app/MapCircuitClient";
import Button from "@/components/admin/Button";
import TimeInput from "@/components/admin/TimeInput";
import { FaSpinner } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";
import { useEffect, useState } from "react";

const CreateCircuitForm = ({ circuitList }: { circuitList: CircuitList[] }) => {
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

  return (
    <>
      <div className="grid grid-cols-[auto_auto] gap-2">
        <div className="flex w-fit flex-wrap gap-2">
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
          <Button value={closed} label="Close" setValue={setClosed} />
          <Button value={points} label="Points" setValue={setPoints} />
        </div>
        <button
          className={` ml-auto flex h-10 items-center rounded-md border-2 bg-neutral-800 px-3 disabled:opacity-50`}
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
      <div className="relative">
        <div className="absolute left-4 top-4 z-10">
          {isLoading && <FaSpinner className="animate-spin text-2xl" />}
          {error && <p>No circuit points found</p>}
        </div>
        {circuitPoints && !error && (
          <MapCircuitClient
            circuitPoints={circuitPoints}
            closed={closed}
            points={points}
            admin={true}
          />
        )}
      </div>
    </>
  );
};
export default CreateCircuitForm;
