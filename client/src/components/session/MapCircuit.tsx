"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import { CircuitInfo } from "@/types";
import { RefObject, useContext, useEffect, useRef } from "react";
import { sessionContext } from "@/store/sessionStore";
import { useStore } from "zustand";

const MapCircuit = ({
  circuitInfo,
  dpr,
  scale,
  width,
}: {
  circuitInfo: CircuitInfo;
  dpr: number;
  scale: number;
  width: number;
}) => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const store = useContext(sessionContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const { setCircuitDimensions, circuitDimensions } = useStore(store);
  const { circuitPoints, angle, finishAngle, finishPoint } = circuitInfo;

  // draw circuit
  useEffect(() => {
    if (circuitInfo && circuitInfo.circuitPoints.length > 0) {
      const circuitDim = drawCircuit(
        circuitRef,
        circuitPoints,
        width,
        dpr,
        scale,
        angle,
        true,
        finishAngle,
        circuitPoints[finishPoint],
      );
      setCircuitDimensions(circuitDim);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [circuitInfo, circuitRef, width, dpr, scale, setCircuitDimensions]);

  return (
    <>
      <canvas
        className={`${circuitDimensions.calcWidth > 0 ? "block" : "hidden"} max-h-[calc(100dvh-92px)] max-w-full sm:max-h-[calc(100dvh-122px)] md:max-h-[calc(100dvh-160px)] lg:max-h-[calc(100dvh-186px)]`}
        ref={circuitRef}
      ></canvas>
    </>
  );
};
export default MapCircuit;
