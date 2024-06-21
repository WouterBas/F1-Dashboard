"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import { CircuitPoints } from "@/types";
import { RefObject, useContext, useEffect, useRef } from "react";
import { AppContext } from "@/store/appStore";
import { useStore } from "zustand";

const MapCircuit = ({
  circuitPoints,
  dpr,
  scale,
  width,
}: {
  circuitPoints: CircuitPoints[];
  dpr: number;
  scale: number;
  width: number;
}) => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const store = useContext(AppContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const { setCircuitDimensions } = useStore(store);

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0) {
      const circuitDim = drawCircuit(
        circuitRef,
        circuitPoints,
        width,
        dpr,
        scale,
      );
      setCircuitDimensions(circuitDim);
    }
  }, [circuitPoints, circuitRef, width, dpr, scale, setCircuitDimensions]);

  return (
    <canvas
      className="max-h-[calc(100dvh-76px)] max-w-full sm:max-h-[calc(100dvh-102px)] md:max-h-[calc(100dvh-130px)] lg:max-h-[calc(100dvh-158px)]"
      ref={circuitRef}
    ></canvas>
  );
};
export default MapCircuit;
