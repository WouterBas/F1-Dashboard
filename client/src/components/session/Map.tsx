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
import { sessionContext } from "@/store/sessionStore";
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
  const store = useContext(sessionContext);
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
          className=" max-h-[calc(100dvh-92px)] max-w-full sm:max-h-[calc(100dvh-122px)] md:max-h-[calc(100dvh-160px)] lg:max-h-[calc(100dvh-186px)]"
          style={{ aspectRatio: circuitInfo.aspectRatio }}
        ></div>
      )}

      <div className="mx-auto w-fit ">
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
