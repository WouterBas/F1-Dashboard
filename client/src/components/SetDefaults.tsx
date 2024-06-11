"use client";
import { useEffect } from "react";
import { store } from "@/store";
import { SessionGp } from "@/types";

const SetDefaults = ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const { setTime, isPlaying, toggleIsPlaying, setWasPlaying, setMinute } =
    store();

  useEffect(() => {
    setTime(new Date(sessionInfo.startDate));
    isPlaying && toggleIsPlaying();
    setWasPlaying(false);
    setMinute(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionInfo, setMinute, setTime, setWasPlaying, toggleIsPlaying]);
  return <></>;
};
export default SetDefaults;
