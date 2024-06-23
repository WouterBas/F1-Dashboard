"use client";
import { sessionContext } from "@/store/sessionStore";
import { useContext } from "react";
import { FaRegCircle, FaRegCircleCheck } from "react-icons/fa6";
import { useStore } from "zustand";

const Labels = () => {
  const store = useContext(sessionContext);
  if (!store) throw new Error("Missing sessionContext.Provider in the tree");
  const { showLabels, toggleShowLabels } = useStore(store);
  return (
    <button
      className="flex items-center gap-1 rounded text-xs sm:left-2 sm:top-2 sm:text-sm md:left-3 md:top-3 md:text-base lg:text-lg"
      onClick={toggleShowLabels}
    >
      {showLabels ? <FaRegCircleCheck /> : <FaRegCircle />}
      Labels
    </button>
  );
};
export default Labels;
