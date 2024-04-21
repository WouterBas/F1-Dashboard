const Gp = ({
  name,
  date,
  type,
}: {
  name: string;
  date: Date;
  type: string;
}) => {
  let formattedDate = "";
  if (date) {
    formattedDate = new Date(date).toLocaleDateString();
  }
  return (
    <div className=" grid w-fit grid-cols-[1fr_auto] justify-items-end divide-x-2  justify-self-end text-[10px] sm:text-base">
      <h2 className="col-span-2 text-xs sm:text-lg">{name}</h2>
      <h3 className="border-none pr-2">{type}</h3>
      <h3 className="pl-2">{formattedDate}</h3>
    </div>
  );
};
export default Gp;
