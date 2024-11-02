const NumberInput = ({
  label,
  id,
  angle,
  setAngle,
  setSaved,
}: {
  label: string;
  id: string;
  angle: number;
  setAngle: React.Dispatch<React.SetStateAction<number>>;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex items-center gap-2 rounded-md bg-neutral-800 px-1 py-1 pl-2 ">
      <label htmlFor={id}>{label}</label>
      <input
        className="rounded border-2 border-neutral-700 bg-neutral-700 pl-2 tracking-wider outline-none focus:border-neutral-500 "
        type="number"
        min="0"
        max={label === "Angle" ? 360 : 999}
        id={id}
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
