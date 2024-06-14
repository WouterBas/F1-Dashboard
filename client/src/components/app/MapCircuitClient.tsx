"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import { CircuitDimensions, CircuitPoints, SessionGp } from "@/types";
import { RefObject, useEffect, useRef, useState } from "react";
import MediaControls from "./MediaControls";
import MapDrivers from "@/components/app/MapDrivers";

const MapCircuitClient = ({
  circuitPoints,
  sessionInfo,
  closed = true,
  points = false,
  admin = false,
}: {
  circuitPoints: CircuitPoints[];
  sessionInfo?: SessionGp;
  closed?: boolean;
  points?: boolean;
  admin?: boolean;
}) => {
  const circuitRef: RefObject<HTMLCanvasElement> =
    useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [circuitDimensions, setCircuitDimensions] = useState<CircuitDimensions>(
    {} as CircuitDimensions,
  );
  const [dpr, setDpr] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // set dpr
  useEffect(() => {
    setDpr(window.devicePixelRatio);
  }, []);

  // set width
  useEffect(() => {
    window.addEventListener("resize", () => {
      mainRef.current && setWidth(mainRef.current.clientWidth);
    });
    mainRef.current && setWidth(mainRef.current.clientWidth);
  }, [circuitRef, circuitPoints]);

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0) {
      const circuitDim = drawCircuit(
        circuitRef,
        circuitPoints,
        closed,
        points,
        width,
        dpr,
      );
      setCircuitDimensions(circuitDim);
    }
    setLoading(false);
  }, [circuitPoints, circuitRef, width, dpr, closed, points]);

  return (
    <div
      className={`${admin ? "max-h-[calc(100dvh-180px)]" : "max-h-[calc(100dvh-100px)]"} relative rounded-lg bg-neutral-800 p-2 sm:p-3 md:p-4`}
      ref={mainRef}
    >
      {loading && (
        <div className="relative mx-auto h-[calc(100dvh-170px)] w-full animate-pulse rounded bg-neutral-700"></div>
      )}
      <div className="relative mx-auto w-full max-w-fit">
        {sessionInfo && (
          <MapDrivers
            sessionInfo={sessionInfo}
            circuitDimensions={circuitDimensions}
            width={width}
            dpr={dpr}
          />
        )}
        <canvas
          className={`${admin ? "max-h-[calc(100dvh-210px)]" : "max-h-[calc(100dvh-130px)]"} mx-auto max-w-full`}
          ref={circuitRef}
        ></canvas>
      </div>

      {sessionInfo && <MediaControls sessionInfo={sessionInfo} />}
    </div>
  );
};
export default MapCircuitClient;
