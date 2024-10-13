"use client";
import { useContext, useRef } from "react";
import MapCircuit from "./MapCircuit";
import { CircuitInfo, SessionGp } from "@/types";
import MapDrivers from "./MapDrivers";
import { sessionContext } from "@/store/sessionStore";
import { useStore } from "zustand";
import useResize from "@/hooks/useResize";

const Map = ({
  sessionInfo,
  circuitInfo,
}: {
  sessionInfo: SessionGp;
  circuitInfo: CircuitInfo;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { dpr, scale, width } = useResize({ mapRef });
  const store = useContext(sessionContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const { circuitDimensions } = useStore(store);

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
