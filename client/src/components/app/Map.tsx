"use client";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MapCircuit from "./MapCircuit";
import { CircuitInfo, SessionGp } from "@/types";
import MapDrivers from "./MapDrivers";
import { AppContext } from "@/store/appStore";
import { useStore } from "zustand";

const Map = ({
  sessionInfo,
  circuitInfo,
}: {
  sessionInfo: SessionGp;
  circuitInfo: CircuitInfo;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [dpr, setDpr] = useState<number>(3);
  const [scale, setScale] = useState<number>(1);
  const store = useContext(AppContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const {
    time,
    setTime,
    isPlaying,
    setMinute,
    toggleIsPlaying,
    speed,
    circuitDimensions,
  } = useStore(store);

  // set dpr
  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  // set width
  useEffect(() => {
    window.addEventListener("resize", () => {
      onResize();
    });
    onResize();
  }, []);

  function onResize() {
    mapRef.current && setWidth(mapRef.current.clientWidth);
    const width = window.innerWidth;
    let deviceScale = 3;
    if (width < 640) {
      deviceScale = 1.25;
    } else if (width < 768) {
      deviceScale = 2;
    } else if (width < 1024) {
      deviceScale = 2.5;
    } else {
      deviceScale = 3;
    }
    setScale(deviceScale);
  }

  // main clock animation
  useLayoutEffect(() => {
    if (isPlaying) {
      let animationFrameId: number;
      const startTime = performance.now();

      const render = () => {
        const timeDifference =
          performance.now() - new Date(startTime).getTime();
        const newTime = new Date(
          new Date(time).getTime() + timeDifference * speed,
        );

        if (newTime > new Date(sessionInfo.endDate)) {
          toggleIsPlaying();
          return () => cancelAnimationFrame(animationFrameId);
        }
        setTime(newTime);

        const minute = Math.floor(
          (newTime.getTime() - new Date(sessionInfo.startDate).getTime()) /
            1000 /
            60,
        );

        setMinute(minute);

        animationFrameId = requestAnimationFrame(render);
      };
      animationFrameId = requestAnimationFrame(render);
      return () => cancelAnimationFrame(animationFrameId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div className="relative w-full" ref={mapRef}>
      {circuitDimensions.calcWidth < 1 && (
        <div
          className=" h-full max-h-[calc(100dvh-76px)] sm:max-h-[calc(100dvh-102px)] md:max-h-[calc(100dvh-130px)] lg:max-h-[calc(100dvh-158px)]"
          style={{ aspectRatio: circuitInfo.aspectRatio }}
        ></div>
      )}
      <div className=" mx-auto w-fit">
        <MapCircuit
          circuitInfo={circuitInfo}
          dpr={dpr}
          scale={scale}
          width={width}
        />
        <MapDrivers
          sessionInfo={sessionInfo}
          circuitInfo={circuitInfo}
          dpr={dpr}
          scale={scale}
          width={width}
        />
      </div>
    </div>
  );
};
export default Map;
