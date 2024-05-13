import { SessionGp, driverList } from "@/types/defentions";
import { RefObject, useEffect, useRef } from "react";

const Map = ({
  sessionInfo,
  drivers,
}: {
  sessionInfo: SessionGp;
  drivers: driverList[];
}) => {
  const { circuitInfo } = sessionInfo;
  const ref: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
  console.log(circuitInfo);

  useEffect(() => {}, []);

  const draw = () => {
    const canvas = ref.current as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.beginPath();
    context.arc(50, 50, 50, 0, 2 * Math.PI);
    context.fill();
  };

  return (
    <div className="relative max-h-[calc(100dvh-100px)] rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
      <canvas
        ref={ref}
        className="mx-auto border"
        style={{ width: "100px", height: "100px" }}
      />
    </div>
  );
};
export default Map;
