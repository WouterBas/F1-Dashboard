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
  const [deviceWidth, setDeviceWidth] = useState<number>(1);

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
  }, [circuitRef, circuitPoints]);

  function onResize() {
    mainRef.current && setWidth(mainRef.current.clientWidth);
    const width = window.innerWidth;
    let deviceWidth = 4;
    if (width < 640) {
      deviceWidth = 1;
    } else if (width < 768) {
      deviceWidth = 2;
    } else if (width < 1024) {
      deviceWidth = 3;
    } else {
      deviceWidth = 4;
    }
    setDeviceWidth(deviceWidth);
  }

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
        deviceWidth,
      );
      setCircuitDimensions(circuitDim);
    }
  }, [circuitPoints, circuitRef, width, dpr, closed, points, deviceWidth]);

  return (
    <div
      className={`${admin ? "max-h-[calc(100dvh-240px)] sm:max-h-[calc(100dvh-244px)] md:max-h-[calc(100dvh-216px)] lg:max-h-[calc(100dvh-176px)] 2xl:max-h-[calc(100dvh-132px)]" : "max-h-[calc(100dvh-52px)] sm:max-h-[calc(100dvh-72px)] md:max-h-[calc(100dvh-86px)] lg:max-h-[calc(100dvh-98px)]"} relative rounded-md bg-neutral-800 p-1 sm:p-2 md:p-3`}
      ref={mainRef}
    >
      <div className="relative mx-auto w-full max-w-fit">
        {sessionInfo && (
          <MapDrivers
            sessionInfo={sessionInfo}
            circuitDimensions={circuitDimensions}
            width={width}
            dpr={dpr}
            deviceWidth={deviceWidth}
          />
        )}
        <canvas
          className={`${admin ? "max-h-[calc(100dvh-250px)] sm:max-h-[calc(100dvh-260px)] md:max-h-[calc(100dvh-240px)] lg:max-h-[calc(100dvh-200px)] 2xl:max-h-[calc(100dvh-156px)]" : "max-h-[calc(100dvh-82px)] sm:max-h-[calc(100dvh-110px)] md:max-h-[calc(100dvh-138px)] lg:max-h-[calc(100dvh-158px)]"} mx-auto max-w-full`}
          ref={circuitRef}
        ></canvas>
      </div>

      {sessionInfo && <MediaControls sessionInfo={sessionInfo} />}
    </div>
  );
};
export default MapCircuitClient;