"use client";
import { useHomeStore } from "@/store/homeStore";
import { SessionList } from "@/types";

export default function AppInitializer({
  sessions,
  children,
}: {
  sessions: SessionList[];
  children: React.ReactNode;
}) {
  useHomeStore.setState({
    selected: {
      year: sessions[0].year.toString(),
      gp: sessions[0].name,
      type: sessions[0].type,
    },
  });

  return children;
}
