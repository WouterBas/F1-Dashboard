import { FaRegSquare, FaRegSquareCheck } from "react-icons/fa6";

const ButtonAdmin = ({
  value,
  label,
  setValue,
}: {
  value: boolean;
  label: string;
  setValue: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center rounded bg-neutral-800 px-2 py-1 ">
      <label
        htmlFor={label}
        className="flex select-none items-center gap-2 hover:cursor-pointer"
      >
        {value ? (
          <FaRegSquareCheck className="text-lg" />
        ) : (
          <FaRegSquare className="text-lg" />
        )}
        {label}
      </label>
      <input
        hidden
        type="checkbox"
        name={label}
        id={label}
        checked={value}
        onChange={() => setValue(!value)}
      />
    </div>
  );
};
export default ButtonAdmin;
