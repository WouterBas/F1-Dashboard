"use client";
import { CircuitList, CircuitPoints } from "@/types";
import DropdownAdmin from "@/components/formInputs/DropdownAdmin";
import { useAdminStore } from "@/store/adminStore";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import MapCircuitClient from "@/components/MapCircuitClient";
import ButtonAdmin from "@/components/formInputs/ButtonAdmin";
import TimeInput from "@/components/formInputs/TimeInput";
import { FaSpinner } from "react-icons/fa6";
import { apiService } from "@/services/api.service";
import useSWRMutation from "swr/mutation";
import { useEffect } from "react";

const CreateCircuitForm = ({ circuitList }: { circuitList: CircuitList[] }) => {
  const {
    selected,
    setSelected,
    closed,
    points,
    setClosed,
    setPoints,
    duration,
    setDuration,
    startTime,
    setStartTime,
    saved,
    setSaved,
  } = useAdminStore();

  // set Default Values
  useEffect(() => {
    if (circuitList[0].driverKey && circuitList[0].sessionKey) {
      setSelected({
        ...selected,
        sessionKey: circuitList[0].sessionKey,
        driverKey: circuitList[0].driverKey,
      });
      if (circuitList[0].startTime) {
        setStartTime(new Date(circuitList[0].startTime));
      }
      if (circuitList[0].duration) {
        setDuration(circuitList[0].duration);
      }
    }
  }, [circuitList]);

  const availableCircuits = circuitList.map((circuit) => ({
    name: circuit.name,
    value: circuit.circuitKey,
  }));

  const availableSessions = circuitList
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

  const availableDrivers = circuitList
    .filter((circuit) => circuit.circuitKey === selected.circuitKey)
    .map((circuit) => circuit.sessions)
    .flat()
    [sessionIndex].drivers.map((driver) => ({
      name: driver.abbreviation,
      value: driver.racingNumber,
    }));

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

  // save circuit
  const { trigger } = useSWRMutation(
    `circuit/${selected.circuitKey}`,
    (url) => {
      apiService
        .patch(url, {
          json: {
            circuitPoints,
            circuitKey: selected?.circuitKey,
            sessionKey: selected?.sessionKey,
            driverKey: selected?.driverKey,
            startTime,
            duration,
          },
          credentials: "include",
        })
        .then((res) => res.ok && setSaved(true));
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
          <DropdownAdmin
            options={availableCircuits}
            value="circuitKey"
            label="Circuit"
            circuitList={circuitList}
          />
          <DropdownAdmin
            options={availableSessions}
            value="sessionKey"
            label="Session"
            circuitList={circuitList}
          />

          <DropdownAdmin
            options={availableDrivers}
            value="driverKey"
            label="Driver"
          />

          <TimeInput
            value={new Date(startTime).toTimeString().split(" ")[0]}
            label="Start Time"
            step={1}
            onChange={(e) => {
              setSaved(false);
              const day = new Date(startTime).toISOString().split("T")[0];
              setStartTime(new Date(`${day}T${e.target.value}.000`));
            }}
          />
          <TimeInput
            value={getFormattedTime(duration)}
            label="Duration"
            step={60}
            onChange={(e) => {
              setSaved(false);
              const milliSeconds: number =
                e.target.value.split(":").reduce((a, b) => a * 60 + +b, 0) *
                1000;
              if (milliSeconds < 180000) {
                setDuration(milliSeconds);
              }
            }}
          />
          <ButtonAdmin value={closed} label="Close" setValue={setClosed} />
          <ButtonAdmin value={points} label="Points" setValue={setPoints} />
        </div>
        <button
          className={` ml-auto flex h-10 items-center rounded-md border-2 bg-neutral-800 px-3 disabled:opacity-50`}
          disabled={saved}
          onClick={() => trigger()}
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
