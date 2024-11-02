import { FaChevronDown } from "react-icons/fa6";

const Dropdown = ({
  options,
  onChange,
  value,
  id,
  label,
}: {
  options: { name: string; value: number }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: number;
  id: string;
  label: string;
}) => {
  return (
    <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1 py-1 pl-2">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <select
          id={id}
          onChange={onChange}
          value={value}
          className="block w-full appearance-none rounded border-2 border-neutral-700 bg-neutral-700 px-2  pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
        >
          {options.map(({ name, value }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
        <FaChevronDown className="pointer-events-none absolute right-2 top-1.5" />
      </div>
    </div>
  );
};
export default Dropdown;
