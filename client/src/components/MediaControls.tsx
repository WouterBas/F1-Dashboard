import { store } from "@/store/";
import { SessionGp } from "@/types";
import { FaPlay, FaPause } from "react-icons/fa6";

const MediaControls = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const { isPlaying, setTime, time, toggleIsPlaying } = store();

  return (
    <div className="absolute bottom-2 flex w-full items-center gap-2 ">
      <div className="flex items-center gap-1">
        <button
          className="rounded-md bg-neutral-700 p-2 text-sm"
          onClick={() => setTime(new Date(sessionInfo.startDate))}
        >
          Reset
        </button>
        <button
          className="rounded-full bg-neutral-700 p-2 text-sm"
          onClick={() => toggleIsPlaying()}
        >
          {isPlaying ? <FaPause /> : <FaPlay className="translate-x-0.5" />}
        </button>
      </div>

      <p className="text-sm">{`${time.toLocaleTimeString()}:${time.getMilliseconds()}`}</p>
    </div>
  );
};
export default MediaControls;
