"use client";
import { SessionList } from "@/types";
import Dropdown from "@/components/home/Dropdown";
import Link from "next/link";
import { useContext } from "react";
import { HomeContext } from "@/store/homeStore";
import { useStore } from "zustand";

const SelectSession = ({ sessions }: { sessions: SessionList[] }) => {
  const store = useContext(HomeContext);
  if (!store) throw new Error("Missing HomeContext.Provider in the tree");
  const { selected } = useStore(store);

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
  const { slug } = selectedSession as SessionList;

  return (
    <div className="mx-auto grid w-fit justify-center gap-4  lg:grid-cols-3">
      <Dropdown options={availableYears} value="year" label="Year" />
      <Dropdown options={availableGp} value="gp" label="Grand Prix" />
      <Dropdown options={availableTypes} value="type" label="Type" />
      <Link
        href={slug}
        className="mx-auto mt-4 block w-full rounded-md border-2 border-white py-1 text-center font-mono sm:text-lg lg:col-start-2"
      >
        View
      </Link>
    </div>
  );
};
export default SelectSession;
