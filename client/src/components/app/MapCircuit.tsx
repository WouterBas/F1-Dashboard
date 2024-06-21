"use client";
import { drawCircuit } from "@/utils/drawCircuit";
import {
  CircuitDimensions,
  CircuitPoints,
  SessionGp,
  Trackstatus,
} from "@/types";
import { RefObject, useEffect, useRef, useState } from "react";
import MediaControls from "./MediaControls";
import MapDrivers from "@/components/app/MapDrivers";
import TrackStatus from "@/components/app/TrackStatus";
import { FaRegCircleCheck, FaRegCircle } from "react-icons/fa6";
import { useAppStore } from "@/store/appStore";

const MapCircuit = ({
  circuitPoints,
  sessionInfo,
  trackStatus,
  closed = true,
  points = false,
  admin = false,
}: {
  circuitPoints: CircuitPoints[];
  trackStatus?: Trackstatus[];
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
  const [dpr, setDpr] = useState<number>(3);
  const [deviceWidth, setDeviceWidth] = useState<number>(1);
  const { showLabels, toggleShowLabels } = useAppStore();

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
    let deviceWidth = 3;
    if (width < 640) {
      deviceWidth = 1.25;
    } else if (width < 768) {
      deviceWidth = 2;
    } else if (width < 1024) {
      deviceWidth = 2.5;
    } else {
      deviceWidth = 3;
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
      className={`${admin ? "max-h-[calc(100dvh-232px)] sm:max-h-[calc(100dvh-236px)] md:max-h-[calc(100dvh-208px)] lg:max-h-[calc(100dvh-176px)] 2xl:max-h-[calc(100dvh-132px)]" : "max-h-[calc(100dvh-46px)] sm:max-h-[calc(100dvh-64px)] md:max-h-[calc(100dvh-78px)] lg:max-h-[calc(100dvh-98px)]"} relative rounded-md bg-neutral-800 p-1 sm:p-2 md:p-3`}
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
          className={`${admin ? "max-h-[calc(100dvh-242px)] sm:max-h-[calc(100dvh-252px)] md:max-h-[calc(100dvh-232px)] lg:max-h-[calc(100dvh-200px)] 2xl:max-h-[calc(100dvh-156px)]" : "max-h-[calc(100dvh-76px)] sm:max-h-[calc(100dvh-102px)] md:max-h-[calc(100dvh-130px)] lg:max-h-[calc(100dvh-158px)]"} mx-auto max-w-full`}
          ref={circuitRef}
        ></canvas>
      </div>

      {sessionInfo && trackStatus && (
        <MediaControls sessionInfo={sessionInfo} trackStatusAll={trackStatus} />
      )}
      {trackStatus && <TrackStatus trackStatusAll={trackStatus} />}
      {!admin && (
        <button
          className="absolute left-1 top-1 flex items-center gap-1 rounded text-xs sm:left-2 sm:top-2 sm:text-sm md:left-3 md:top-3 md:text-base lg:text-lg"
          onClick={toggleShowLabels}
        >
          {showLabels ? <FaRegCircleCheck /> : <FaRegCircle />}
          Labels
        </button>
      )}
    </div>
  );
};
export default MapCircuit;
