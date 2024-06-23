"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import { CircuitInfo } from "@/types";
import { RefObject, useContext, useEffect, useRef } from "react";
import { AppContext } from "@/store/appStore";
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
  const store = useContext(AppContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const { setCircuitDimensions, circuitDimensions } = useStore(store);

  // draw circuit
  useEffect(() => {
    if (circuitInfo && circuitInfo.circuitPoints.length > 0) {
      const circuitDim = drawCircuit(
        circuitRef,
        circuitInfo.circuitPoints,
        width,
        dpr,
        scale,
        circuitInfo.angle,
      );
      setCircuitDimensions(circuitDim);
    }
  }, [circuitInfo, circuitRef, width, dpr, scale, setCircuitDimensions]);

  return (
    <>
      <canvas
        className={`${circuitDimensions.calcWidth > 0 ? "block" : "hidden"} max-h-[calc(100dvh-76px)] max-w-full sm:max-h-[calc(100dvh-102px)] md:max-h-[calc(100dvh-130px)] lg:max-h-[calc(100dvh-158px)]`}
        ref={circuitRef}
      ></canvas>
    </>
  );
};
export default MapCircuit;
