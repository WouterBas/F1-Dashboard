import Image from "next/image";
import { Circuit } from "@/types/defentions";

const Map = ({ circuitInfo }: { circuitInfo: Circuit }) => {
  const [{ imageURL, imageHeight, imageWidth }] = circuitInfo;
  console.log(imageURL);

  return (
    <div className="max-h-[calc(100dvh-100px)] rounded-lg  bg-neutral-800 p-2  sm:p-3  md:p-4">
      {imageURL !== undefined && (
        <Image
          width={imageWidth}
          height={imageHeight}
          src={imageURL || ""}
          priority
          // onLoad={() => setImageLoading(true)}
          alt=""
          // ref={img}
          style={{ width: "auto" }}
          className="mx-auto max-h-[calc(100dvh-132px)]  object-contain"
        ></Image>
      )}
    </div>
  );
};
export default Map;
