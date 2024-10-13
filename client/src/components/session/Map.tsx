"use client";
import { useContext, useEffect, useRef, useState } from "react";
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
  const { circuitDimensions } = useStore(store);

  // set dpr
  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  // set width
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
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
  };

  return (
    <div className="relative w-full" ref={mapRef}>
      {circuitDimensions.calcWidth < 1 && (
        <div
          className=" max-h-[calc(100dvh-92px)] max-w-full sm:max-h-[calc(100dvh-122px)] md:max-h-[calc(100dvh-160px)] lg:max-h-[calc(100dvh-186px)]"
          style={{ aspectRatio: circuitInfo.aspectRatio }}
        ></div>
      )}

      <div className="mx-auto w-fit">
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
