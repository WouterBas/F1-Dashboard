import { useAdminStore } from "@/store/adminStore";

const TimeInput = ({
  value,
  label,
  step,
}: {
  value: string;
  label: string;
  step: number;
}) => {
  const { setDuration, setSaved, setStartTime, startTime } = useAdminStore();
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    if (label === "Duration") {
      const milliSeconds: number =
        e.target.value.split(":").reduce((a, b) => a * 60 + +b, 0) * 1000;
      if (milliSeconds < 180000) {
        setDuration(milliSeconds);
      }
    }
    if (label === "Start Time") {
      setSaved(false);
      const day = new Date(startTime).toISOString().split("T")[0];
      setStartTime(new Date(`${day}T${e.target.value}.000`));
    }
  };
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
        onChange={onChangeHandler}
      />
    </div>
  );
};
export default TimeInput;
