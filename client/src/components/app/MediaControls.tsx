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
    speed,
    setSpeed,
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
        onChange={(e) => {
          if (isPlaying) {
            toggleIsPlaying();
            setSpeed(parseInt(e.target.value));
            setTimeout(() => toggleIsPlaying(), 1);
          }
          setSpeed(parseInt(e.target.value));
        }}
      >
        <option value="1">x1</option>
        <option value="2">x2</option>
        <option value="4">x4</option>
        <option value="8">x8</option>
        <option value="16">x16</option>
      </select>

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

      <p>{`${time.toLocaleTimeString("en-GB")}`}</p>
    </div>
  );
};
export default MediaControls;
