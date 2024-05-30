import { useMediaStore } from "@/store/mediaStore";
import { FaPlay, FaPause, FaForward } from "react-icons/fa6";

const MediaControls = () => {
  const { isPlaying, setIsPlaying, setNotPlaying } = useMediaStore();
  return (
    <div className="flex w-full items-end justify-between">
      <div className="flex items-center gap-1">
        <button className="rounded-full bg-neutral-700 p-2 text-sm">
          <FaForward className="rotate-180" />
        </button>
        <button
          className="rounded-full bg-neutral-700 p-2 text-sm"
          onClick={() => (isPlaying ? setNotPlaying() : setIsPlaying())}
        >
          {!isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button className="rounded-full bg-neutral-700 p-2 text-sm">
          <FaForward />
        </button>
        <p className="text-sm">x1</p>
      </div>

      <p>00:00:00</p>
    </div>
  );
};
export default MediaControls;
