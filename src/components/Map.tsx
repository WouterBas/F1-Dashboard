import Image from "next/image";
import { Circuit } from "@/types/defentions";

const Map = ({ circuitInfo }: { circuitInfo: Circuit }) => {
  const [{ imageUrl, imageHeight, imageWidth }] = circuitInfo;
  return (
    <div className="max-h-[calc(100dvh-100px)] rounded-lg  bg-neutral-800 p-2  sm:p-3  md:p-4">
      <Image
        width={imageWidth}
        height={imageHeight}
        src={imageUrl}
        priority
        // onLoad={() => setImageLoading(true)}
        alt=""
        // ref={img}
        className="mx-auto max-h-[calc(100dvh-132px)]  object-contain"
      ></Image>
    </div>
  );
};
export default Map;
