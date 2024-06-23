import { useAdminStore } from "@/store/adminStore";

const NumberInput = () => {
  const { angle, setAngle, setSaved } = useAdminStore();

  return (
    <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1 py-1 pl-2 ">
      <label htmlFor="angle">Angle</label>
      <input
        className="rounded border-2 border-neutral-700 bg-neutral-700 pl-2 tracking-wider outline-none focus:border-neutral-500 "
        type="number"
        min="0"
        max="360"
        id="angle"
        value={angle}
        onChange={(e) => {
          setAngle(parseInt(e.target.value));
          setSaved(false);
        }}
      />
    </div>
  );
};
export default NumberInput;
