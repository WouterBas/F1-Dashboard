"use client";
import { useAppStore } from "@/store/appStore";
import { SessionGp } from "@/types";

export default function AppInitializer({
  sessionInfo,
  children,
}: {
  sessionInfo: SessionGp;
  children: React.ReactNode;
}) {
  useAppStore.setState({
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
    })),
    minute: 0,
    wasPlaying: false,
  });

  return children;
}
