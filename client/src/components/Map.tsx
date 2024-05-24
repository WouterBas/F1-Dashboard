import { drawCircuit } from "@/app/utils/drawCircuit";
import fetcher from "@/app/utils/fetcher";
import { CircuitPoints, SessionGp } from "@/types";
import { RefObject, useEffect, useRef } from "react";
import useSWR from "swr";

const Map = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const ref: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);

  const { data: circuitPoints } = useSWR<CircuitPoints[]>(
    `circuit/points/${sessionInfo.circuitKey}`,
    fetcher,
  );

  // draw circuit
  useEffect(() => {
    if (circuitPoints && circuitPoints.length > 0) {
      drawCircuit(ref, circuitPoints);
    }
  }, [circuitPoints]);

  return (
    <div className="relative rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
      <div className="relative mx-auto w-fit">
        <canvas
          className="mx-auto max-h-[calc(100dvh-170px)] w-full"
          ref={ref}
        ></canvas>
      </div>
    </div>
  );
};
export default Map;
