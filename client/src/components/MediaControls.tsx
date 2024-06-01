import { store } from "@/store/";
import { useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa6";

const MediaControls = () => {
  const { isPlaying, time, setTime, setIsPlaying, setNotPlaying } = store();

  // useEffect(() => {
  //   if (isPlaying) {
  //     const interval = setInterval(() => {
  //       setTime(new Date(time.getTime() + 1));
  //     }, 1);
  //     return () => clearInterval(interval);
  //   }
  // }, [isPlaying, time, setTime]);

  return (
    <div className="absolute bottom-2 flex w-full items-center gap-2 ">
      <div className="flex items-center gap-1">
        {/* <button className="rounded-full bg-neutral-700 p-2 text-sm">
          <FaForward className="rotate-180" />
        </button> */}
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
