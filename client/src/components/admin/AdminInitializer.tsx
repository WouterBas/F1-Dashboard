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
      circuitKey: 9,
      sessionKey: circuitList[0].sessionKey || 9213,
      driverKey: circuitList[0].driverKey || 1,
    },
    closed: false,
    points: true,
    startTime: new Date(circuitList[0].startTime || "2023-10-22T19:00:00.000Z"),
    duration: circuitList[0].duration || 60000,
    saved: false,
  });

  return children;
}
