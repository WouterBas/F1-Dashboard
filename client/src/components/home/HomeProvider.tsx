"use client";
import { createHomeStore, HomeContext, HomeStore } from "@/store/homeStore";
import { SessionList } from "@/types";
import { useRef } from "react";

export default function HomeProvider({
  sessions,
  children,
}: {
  sessions: SessionList[];
  children: React.ReactNode;
}) {
  const storeRef = useRef<HomeStore>();
  if (!storeRef.current) {
    storeRef.current = createHomeStore({
      selected: {
        year: sessions[0].year.toString(),
        gp: sessions[0].name,
        type: sessions[0].type,
      },
    });
  }

  return (
    <HomeContext.Provider value={storeRef.current}>
      {children}
    </HomeContext.Provider>
  );
}
