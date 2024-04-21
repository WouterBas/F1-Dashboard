"use client";
import { FaChevronDown } from "react-icons/fa6";
import { Session } from "@/types/defentions";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Form = ({ sessions }: { sessions: Session[] }) => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(sessions[0].year);
  const [selectedGp, setSelectedGp] = useState(sessions[0].name);
  const [selectedType, setSelecedType] = useState(sessions[0].type);

  const [avalibleGp, setAvalibleGp] = useState(
    sessions.filter((session) => session.year === selectedYear),
  );
  const [avalibleType, setAvalibleType] = useState(
    sessions.filter(
      (session) => session.year === selectedYear && session.name === selectedGp,
    ),
  );

  const handleOnChangeYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));

    const filterGp = sessions.filter(
      (session) => session.year === parseInt(e.target.value),
    );
    const filterType = sessions.filter(
      (session) =>
        session.year === parseInt(e.target.value) &&
        session.name === filterGp[0].name,
    );

    setAvalibleGp(filterGp);
    setAvalibleType(filterType);
    setSelectedGp(filterGp[0].name);
    setSelecedType(filterType[0].type);
  };

  const handleOnChangeGp = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGp(e.target.value);
    const filterType = sessions.filter(
      (session) =>
        session.year === selectedYear && session.name === e.target.value,
    );
    setAvalibleType(filterType);
    setSelecedType(filterType[0].type);
  };
  const handleOnChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelecedType(e.target.value);
  };

  return (
    <form
      className=" mx-auto grid w-fit justify-center gap-4 md:grid-cols-3"
      onSubmit={(e) => {
        e.preventDefault();
        const selectedkey = sessions.find((session) => {
          return (
            session.year === selectedYear &&
            session.name === selectedGp &&
            session.type === selectedType
          );
        });
        router.push(`/session/${selectedkey?.sessionKey}`);
      }}
    >
      <div>
        <label htmlFor="year" className="text-lg">
          Year
        </label>
        <div className="relative">
          <select
            onChange={handleOnChangeYear}
            id="year"
            value={selectedYear}
            className="block w-full appearance-none rounded-md border-2 border-neutral-700 bg-neutral-700 px-2 py-1 pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
          >
            {[...new Set(sessions.map((session) => session.year))].map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ),
            )}
          </select>
          <FaChevronDown className="absolute right-2 top-2.5" />
        </div>
      </div>
      <div className="w-64 ">
        <label htmlFor="gp" className="text-lg">
          Grand Prix
        </label>
        <div className="relative">
          <select
            onChange={handleOnChangeGp}
            id="gp"
            value={selectedGp}
            className="block w-full appearance-none rounded-md border-2 border-neutral-700 bg-neutral-700 px-2 py-1 pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
          >
            {[...new Set(avalibleGp.map((session) => session.name))].map(
              (name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ),
            )}
          </select>
          <FaChevronDown className="absolute right-2 top-2.5" />
        </div>
      </div>
      <div>
        <label htmlFor="type" className="text-lg">
          Session
        </label>
        <div className="relative">
          <select
            onChange={handleOnChangeType}
            id="type"
            value={selectedType}
            className="block w-full appearance-none rounded-md border-2 border-neutral-700 bg-neutral-700 px-2 py-1 pr-8 font-sans tracking-wider outline-none focus:border-neutral-500 "
          >
            {avalibleType.map(({ type }) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-2 top-2.5" />
        </div>
      </div>
      <button
        type="submit"
        className="mx-auto mt-4 block w-full rounded-md border-2 border-white  py-1 text-center font-mono text-lg md:col-start-2"
      >
        View
      </button>
    </form>
  );
};
export default Form;
