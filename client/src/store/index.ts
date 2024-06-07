import { DriverTimingList } from "@/types";
import { create } from "zustand";

type State = {
  isPlaying: boolean;
  time: Date;
  driverList: DriverTimingList[];

  setTime: (time: Date) => void;
  toggleIsPlaying: () => void;
  setDriverList: (driverList: DriverTimingList[]) => void;
};

export const store = create<State>((set) => ({
  isPlaying: false,
  time: new Date(),
  driverList: [],

  setTime: (time: Date) => set({ time }),
  toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setDriverList: (driverList: DriverTimingList[]) => set({ driverList }),
}));
