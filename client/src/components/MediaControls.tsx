import { store } from "@/store/";
import { SessionGp } from "@/types";
import { FaPlay, FaPause } from "react-icons/fa6";

const MediaControls = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const { isPlaying, setTime, time, setIsPlaying, setNotPlaying } = store();

  return (
    <div className="absolute bottom-2 flex w-full items-center gap-2 ">
      <div className="flex items-center gap-1">
        {/* <button className="rounded-full bg-neutral-700 p-2 text-sm">
          <FaForward className="rotate-180" />
        </button> */}
        <button
          className="rounded-md bg-neutral-700 p-2 text-sm"
          onClick={() => setTime(new Date(sessionInfo.startDate))}
        >
          Reset
        </button>
        <button
          className="rounded-full bg-neutral-700 p-2 text-sm"
          onClick={() => (isPlaying ? setNotPlaying() : setIsPlaying())}
        >
          {isPlaying ? <FaPause /> : <FaPlay className="translate-x-0.5" />}
        </button>
        {/* <button className="rounded-full bg-neutral-700 p-2 text-sm">
          <FaForward />
        </button> */}
      </div>

      <p className="text-sm">{`${time.toLocaleTimeString()}:${time.getMilliseconds()}`}</p>
    </div>
  );
};
export default MediaControls;
