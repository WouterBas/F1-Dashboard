"use client";
import { useAdminStore } from "@/store/adminStore";
import { CircuitList } from "@/types";

export default function AppInitializer({
  circuitList,
  children,
}: {
  circuitList: CircuitList[];
  children: React.ReactNode;
}) {
  useAdminStore.setState({
    selected: {
      circuitKey: 147,
      sessionKey: circuitList[0].sessionKey || 6397,
      driverKey: circuitList[0].driverKey || 33,
    },
    closed: false,
    points: true,
    startTime: new Date(circuitList[0].startTime || "2021-05-02T14:00:00.000Z"),
    duration: circuitList[0].duration || 60000,
    saved: false,
  });

  return children;
}
