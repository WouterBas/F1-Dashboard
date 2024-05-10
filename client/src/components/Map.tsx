import Image from "next/image";
import { SessionGp, driverList } from "@/types/defentions";
import MapDrivers from "@/components/MapDrivers";
import { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa6";

const Map = ({
  sessionInfo,
  drivers,
}: {
  sessionInfo: SessionGp;
  drivers: driverList[];
}) => {
  const [{ imageURL, imageHeight, imageWidth }] = sessionInfo.circuitInfo;
  const [imageLoading, setImageLoading] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(new Date(sessionInfo.startDate));
  const [count, setCount] = useState(0);
  const [imgSize, setImgSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (img.current) {
      setImgSize({
        width: img.current.clientWidth,
        height: img.current.clientHeight,
      });
    }
    window.addEventListener("resize", () => {
      if (img.current) {
        setImgSize({
          width: img.current.clientWidth,
          height: img.current.clientHeight,
        });
      }
    });
  }, [imageLoading]);

  useEffect(() => {
    if (isPlaying) {
      const start = new Date().getTime();
      let i = 0;
      const interval = setInterval(() => {
        const time = new Date().getTime() - start;
        const startTime = new Date(sessionInfo.startDate).getTime();
        setTime(new Date(startTime + time));
        setCount(i++);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isPlaying, sessionInfo.startDate]);

  return (
    <div className="relative max-h-[calc(100dvh-100px)]  rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
      <div className="relative mx-auto w-fit  ">
        {imageURL !== undefined && (
          <Image
            width={imageWidth}
            height={imageHeight}
            src={imageURL || ""}
            priority
            onLoad={() => setImageLoading(true)}
            alt=""
            style={{ width: "auto" }}
            ref={img}
            className="max-h-[calc(100dvh-132px)] object-contain"
          ></Image>
        )}

        <MapDrivers
          drivers={drivers}
          size={imgSize}
          sessionInfo={sessionInfo}
          time={time}
        />
      </div>
      <div
        className="absolute bottom-4 left-4 flex items-center rounded-full border-2 bg-neutral-700 px-3 py-1 hover:cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <FaPause className="mr-2" /> : <FaPlay className="mr-2" />}
        {isPlaying ? "Pause" : "Play"}
        <span className="ml-2"> {time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
export default Map;
