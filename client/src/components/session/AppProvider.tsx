"use client";
import { createSessionStore, sessionContext } from "@/store/sessionStore";
import { SessionGp } from "@/types";
import { useRef } from "react";

export default function SessionProvider({
  sessionInfo,
  children,
}: {
  sessionInfo: SessionGp;
  children: React.ReactNode;
}) {
  const store = useRef(
    createSessionStore({
      isPlaying: false,
      time: new Date(sessionInfo.startDate),
      driverList: sessionInfo.drivers.map((driver) => ({
        racingNumber: driver.racingNumber,
        teamColor: driver.teamColor,
        abbreviation: driver.abbreviation,
        inPit: false,
        pitOut: false,
        retired: false,
        position: 0,
        stopped: false,
      })),
      startTime: new Date(sessionInfo.startDate),
      endTime: new Date(sessionInfo.endDate),
      minute: 0,
      circuitDimensions: {
        calcWidth: 0,
        calcHeight: 0,
        scale: 1,
        minX: 0,
        minY: 0,
      },
    }),
  ).current;

  return (
    <sessionContext.Provider value={store}>{children}</sessionContext.Provider>
  );
}
