"use client";
import { SessionList } from "@/types";
import DropdownMain from "@/components/formInputs/dropdownMain";
import { selectSession } from "@/store/selectSession";
import Link from "next/link";
import slugify from "slugify";

const SelectSession = ({ sessions }: { sessions: SessionList[] }) => {
  const { selected } = selectSession();

  const availableYears = [
    ...new Set(sessions.map((session) => session.year.toString())),
  ];
  const availableGp = [
    ...new Set(
      sessions
        .filter((session) => session.year.toString() === selected.year)
        .map((session) => session.name),
    ),
  ];

  const availableTypes = [
    ...new Set(
      sessions
        .filter((session) => session.year.toString() === selected.year)
        .filter((session) => session.name === selected.gp)
        .map((session) => session.type),
    ),
  ];

  const selectedSession = sessions.find((session) => {
    return (
      session.year === parseInt(selected.year) &&
      session.name === selected.gp &&
      session.type === selected.type
    );
  });
  const { year, name, type, sessionKey } = selectedSession as SessionList;

  return (
    <div className="mx-auto grid w-fit justify-center gap-4 md:grid-cols-3">
      <DropdownMain options={availableYears} value="year" label="Year" />
      <DropdownMain options={availableGp} value="gp" label="Grand Prix" />
      <DropdownMain options={availableTypes} value="type" label="Type" />
      <Link
        href={`/${slugify(name, { lower: true })}/${slugify(type, { lower: true })}/${year}/${sessionKey}`}
        className="mx-auto mt-4 block w-full rounded-md border-2 border-white  py-1 text-center font-mono text-lg md:col-start-2"
      >
        View
      </Link>
    </div>
  );
};
export default SelectSession;
