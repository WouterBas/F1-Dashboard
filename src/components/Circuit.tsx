import Image from "next/image";

const Circuit = () => {
  return (
    <div className="max-h-[calc(100dvh-64px)] rounded-lg bg-neutral-800 p-2 sm:max-h-[calc(100dvh-68px)] sm:p-3 md:max-h-[calc(100dvh-80px)] md:p-4">
      <Image
        width={2732}
        height={1687}
        src="http://localhost:4000/static/images/jeddah.png"
        // onLoad={() => setImageLoading(true)}
        alt=""
        // ref={img}
        className="mx-auto max-h-[calc(100dvh-88px)] sm:max-h-[calc(100dvh-92px)] md:max-h-[calc(100dvh-104px)]"
      ></Image>
    </div>
  );
};
export default Circuit;
