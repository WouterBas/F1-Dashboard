"use client";
import useClock from "@/app/hooks/useClock";
import { sessionContext } from "@/store/sessionStore";
import { SessionGp, Trackstatus } from "@/types";
import { useContext, useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa6";
import { useStore } from "zustand";

const MediaControls = ({
  sessionInfo,
  trackStatusAll,
}: {
  sessionInfo: SessionGp;
  trackStatusAll: Trackstatus[];
}) => {
  const store = useContext(sessionContext);
  const [isClient, setIsClient] = useState(false);

  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const {
    isPlaying,
    setTime,
    time,
    toggleIsPlaying,
    setMinute,
    speed,
    setSpeed,
  } = useStore(store);
  const totalSeconds =
    new Date(sessionInfo.endDate).getTime() -
    new Date(sessionInfo.startDate).getTime();

  useClock();

  const changeTimeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(
      (prevTime) =>
        new Date(
          new Date(sessionInfo.startDate).getTime() + parseInt(e.target.value),
        ),
    );
  };

  const handleTimeClick = () => {
    const minute = Math.floor(
      (time.getTime() - new Date(sessionInfo.startDate).getTime()) / 1000 / 60,
    );
    setMinute(minute < 0 ? 0 : minute);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex items-center gap-1 text-[10px] sm:gap-2 sm:text-xs md:gap-3 md:text-sm lg:text-base">
      <button
        className="rounded-full bg-neutral-700 p-1.5 text-xs sm:text-sm md:p-2 md:text-base lg:p-2.5 lg:text-lg"
        onClick={() => toggleIsPlaying()}
        aria-label="Play/Pause"
      >
        {isPlaying ? <FaPause /> : <FaPlay className="translate-x-0.5" />}
      </button>

      <select
        className="appearance-none rounded border-2 border-neutral-700 bg-neutral-700 px-1 text-center outline-none focus:border-neutral-500 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1"
        value={speed}
        name="speed"
        id="speed"
        aria-label="Playback Speed"
        onChange={(e) => setSpeed(parseInt(e.target.value))}
      >
        <option value="1">x1</option>
        <option value="2">x2</option>
        <option value="4">x4</option>
        <option value="8">x8</option>
        <option value="16">x16</option>
        <option value="32">x32</option>
      </select>
      <div className="relative h-1 w-full rounded-s">
        <input
          aria-label="Timeline"
          id="timeline"
          name="timeline"
          type="range"
          min="0"
          max={totalSeconds}
          className="absolute z-10 h-1 w-full appearance-none rounded bg-neutral-500/0 accent-white "
          value={time.getTime() - new Date(sessionInfo.startDate).getTime()}
          onChange={changeTimeHandler}
          onClick={handleTimeClick}
        />

        <div className="relative h-1 overflow-hidden rounded-sm">
          {trackStatusAll.map(({ timestamp, status }) => {
            const currentTime = new Date(timestamp).getTime();
            const percentage =
              ((currentTime - new Date(sessionInfo.startDate).getTime()) /
                totalSeconds) *
              100;
            return (
              <div
                key={timestamp}
                className={`${status === "Yellow Flag" || status === "VSC Deployed" || status === "VSC Ending" || status === "SC Deployed" ? "bg-amber-400" : status === "Red Flag" ? "bg-red-500" : status === "Finished" ? "bg-neutral-300" : "bg-neutral-500"} absolute h-1 w-full overflow-hidden`}
                style={{ left: `${percentage}%` }}
              ></div>
            );
          })}
        </div>
      </div>

      <p>{isClient ? time.toLocaleTimeString("en-GB") : "00:00:00"}</p>
    </div>
  );
};
export default MediaControls;
