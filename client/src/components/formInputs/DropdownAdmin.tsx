import { FaChevronDown } from "react-icons/fa6";
import { useAdminStore } from "@/store/adminStore";
import { CircuitList } from "@/types";

const DropdownAdmin = ({
  options,
  value,
  label,
  circuitList,
}: {
  options: any[];
  value: string;
  label: string;
  circuitList?: CircuitList[];
}) => {
  const { selected, setSelected, setStartTime, setSaved, setDuration } =
    useAdminStore();
  const selectedObj: { [key: string]: string | number } = selected;

  const onChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSaved(false);
    const key = parseInt(e.target.value);
    // Change Circuit
    if (value === "circuitKey" && circuitList) {
      const filteredCircuitKey = circuitList
        .filter((circuit) => circuit.circuitKey === key)
        .map((circuit) => circuit.sessions)
        .flat()[0];

      const {
        sessionKey: dbSessionKey,
        driverKey: dbDriverKey,
        duration,
        startTime,
      } = circuitList.filter((circuit) => circuit.circuitKey === key)[0];

      const filteredSessionKey = filteredCircuitKey.sessionKey;
      const filteredDriverKey = filteredCircuitKey.drivers[0].racingNumber;
      const time = filteredCircuitKey.startDate;

      setSelected({
        circuitKey: key,
        sessionKey: dbSessionKey || filteredSessionKey,
        driverKey: dbDriverKey || filteredDriverKey,
      });
      startTime
        ? setStartTime(new Date(startTime))
        : setStartTime(new Date(time));
      duration && setDuration(duration);

      // Change Session
    } else if (value === "sessionKey" && circuitList) {
      const filteredCircuitKey = circuitList
        .filter((circuit) => circuit.circuitKey === selected.circuitKey)
        .map((circuit) => circuit.sessions)
        .flat();

      const sessionIndex = filteredCircuitKey.findIndex(
        (session) => session.sessionKey === key,
      );
      const time = filteredCircuitKey[sessionIndex].startDate;

      setSelected({
        ...selected,
        sessionKey: key,
        driverKey: filteredCircuitKey[sessionIndex].drivers[0].racingNumber,
      });
      setStartTime(new Date(time));

      // Change Driver
    } else {
      setSelected({ ...selected, driverKey: parseInt(e.target.value) });
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1 py-1 pl-2">
      <label htmlFor="circuit">{label}</label>
      <div className="relative">
        <select
          onChange={onChangeHandler}
          id={value}
          value={selectedObj[value]}
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
export default DropdownAdmin;
