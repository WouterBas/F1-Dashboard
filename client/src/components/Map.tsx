import Image from "next/image";
import { SessionGp, driverList } from "@/types/defentions";
import MapDrivers from "@/components/MapDrivers";
import { useState, useEffect, useRef } from "react";

const Map = ({
  sessionInfo,
  drivers,
}: {
  sessionInfo: SessionGp;
  drivers: driverList[];
}) => {
  const [{ imageURL, imageHeight, imageWidth }] = sessionInfo.circuitInfo;
  const [imageLoading, setImageLoading] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (img.current) {
      setImgSize({
        width: img.current.clientWidth,
        height: img.current.clientHeight,
      });
    }
    window.addEventListener("resize", () => {
      if (img.current) {
        setImgSize({
          width: img.current.clientWidth,
          height: img.current.clientHeight,
        });
      }
    });
  }, [imageLoading]);

  // console.log(imgSize);
  // console.log(img);

  return (
    <div className=" max-h-[calc(100dvh-100px)]  rounded-lg bg-neutral-800  p-2  sm:p-3 md:p-4">
      <div className="relative mx-auto w-fit ">
        {imageURL !== undefined && (
          <Image
            width={imageWidth}
            height={imageHeight}
            src={imageURL || ""}
            priority
            onLoad={() => setImageLoading(true)}
            alt=""
            style={{ width: "auto" }}
            ref={img}
            className="max-h-[calc(100dvh-132px)] object-contain"
          ></Image>
        )}

        <MapDrivers
          drivers={drivers}
          size={imgSize}
          sessionInfo={sessionInfo}
        />
      </div>
    </div>
  );
};
export default Map;
