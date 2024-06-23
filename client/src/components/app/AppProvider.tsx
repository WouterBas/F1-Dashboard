"use client";
import { createAppStore, AppContext } from "@/store/appStore";
import { SessionGp } from "@/types";
import { useRef } from "react";

export default function AppProvider({
  sessionInfo,
  children,
}: {
  sessionInfo: SessionGp;
  children: React.ReactNode;
}) {
  const store = useRef(
    createAppStore({
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
      minute: 0,
      wasPlaying: false,
      circuitDimensions: {
        calcWidth: 0,
        calcHeight: 0,
        scale: 1,
        minX: 0,
        minY: 0,
      },
    }),
  ).current;

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}
