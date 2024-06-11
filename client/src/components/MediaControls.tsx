"use client";
import { store } from "@/store/";
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
  } = store();
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
    <div className="absolute bottom-2 flex w-[calc(100%-2rem)] items-center gap-4">
      <button
        className="rounded-full bg-neutral-700 p-2 text-sm"
        onClick={() => toggleIsPlaying()}
      >
        {isPlaying ? <FaPause /> : <FaPlay className="translate-x-0.5" />}
      </button>

      <input
        type="range"
        min="0"
        max={totalSeconds}
        className="h-1 w-full appearance-none rounded bg-neutral-500 accent-white"
        value={time.getTime() - new Date(sessionInfo.startDate).getTime()}
        onChange={changeTimeHandler}
        onClick={sizeHandler}
      />

      <p className="text-sm">{`${time.toLocaleTimeString("en-GB")}`}</p>
    </div>
  );
};
export default MediaControls;
