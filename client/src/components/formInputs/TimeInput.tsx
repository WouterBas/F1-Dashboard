const TimeInput = ({
  value,
  label,
  step,
  onChange,
}: {
  value: string;
  label: string;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1 py-1 pl-2">
      <label htmlFor={label}>{label}</label>
      <input
        className="rounded border-2 border-neutral-700 bg-neutral-700 px-2 text-center -indent-[1px] text-white focus:border-neutral-500 focus:outline-none"
        id={label}
        type="time"
        step={step}
        name={label}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
export default TimeInput;
