import { SessionGp } from "@/types";

const Gp = ({
  sessionInfo: { name, type, startDate },
}: {
  sessionInfo: SessionGp;
}) => {
  return (
    <div className=" grid w-fit grid-cols-[1fr_auto] justify-items-end divide-x-2  justify-self-end text-[10px] sm:text-base">
      <h2 className="col-span-2 text-xs sm:text-lg">{name}</h2>
      <h3 className="border-none pr-2">{type}</h3>
      <h3 className="pl-2">{new Date(startDate).toLocaleDateString()}</h3>
    </div>
  );
};
export default Gp;
