"use client";
import { useAppStore } from "@/store/appStore";
import { SessionGp } from "@/types";
import { FaPlay, FaPause } from "react-icons/fa6";

const MediaControls = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const {
    isPlaying,
    setTime,
    time,
    toggleIsPlaying,
    setMinute,
    setWasPlaying,
  } = useAppStore();
  const totalSeconds =
    new Date(sessionInfo.endDate).getTime() -
    new Date(sessionInfo.startDate).getTime();

  const changeTimeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPlaying) {
      toggleIsPlaying();
      setWasPlaying(true);
    }
    setTime(
      new Date(
        new Date(sessionInfo.startDate).getTime() + parseInt(e.target.value),
      ),
    );
  };
  const sizeHandler = () => {
    const minute = Math.floor(
      (time.getTime() - new Date(sessionInfo.startDate).getTime()) / 1000 / 60,
    );
    setMinute(minute);
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
      <button
        className="rounded-full bg-neutral-700 p-1.5 text-[10px] sm:text-sm md:p-2 md:text-base lg:p-2.5 lg:text-lg"
        onClick={() => toggleIsPlaying()}
        aria-label="Play/Pause"
      >
        {isPlaying ? <FaPause /> : <FaPlay className="translate-x-0.5" />}
      </button>

      <input
        aria-label="Timeline"
        id="timeline"
        type="range"
        min="0"
        max={totalSeconds}
        className="h-1 w-full appearance-none rounded bg-neutral-500 accent-white"
        value={time.getTime() - new Date(sessionInfo.startDate).getTime()}
        onChange={changeTimeHandler}
        onClick={sizeHandler}
      />

      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base">{`${time.toLocaleTimeString("en-GB")}`}</p>
    </div>
  );
};
export default MediaControls;
