import { HomeContext } from "@/store/homeStore";
import { useContext } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { useStore } from "zustand";

const Dropdown = ({
  options,
  value,
  label,
}: {
  options: any[];
  value: string;
  label: string;
}) => {
  const store = useContext(HomeContext);
  if (!store) throw new Error("Missing HomeContext.Provider in the tree");
  const { selected, setSelected } = useStore(store);
  const selectedObj: { [key: string]: string } = selected;

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (value === "year") {
      setSelected({
        gp: "Bahrain Grand Prix",
        type: "Race",
        year: e.target.value,
      });
    } else if (value === "gp") {
      setSelected({
        ...selected,
        gp: e.target.value,
        type: "Race",
      });
    } else {
      setSelected({
        ...selected,
        type: e.target.value,
      });
    }
  };

  return (
    <div>
      <label htmlFor={value} className="text-base sm:text-lg">
        {label}
      </label>
      <div className="relative">
        <select
          onChange={onChangeHandler}
          id={value}
          value={selectedObj[value]}
          className="block w-[236px] appearance-none rounded-md border-2 border-neutral-700 bg-neutral-700 px-2 py-1 pr-8 font-sans text-sm tracking-wider outline-none focus:border-neutral-500 sm:w-[260px] sm:text-base"
        >
          {options.map((option: any) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <FaChevronDown className="pointer-events-none absolute right-2 top-2.5" />
      </div>
    </div>
  );
};
export default Dropdown;
