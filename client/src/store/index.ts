import { DriverTimingList } from "@/types";
import { create } from "zustand";

type State = {
  isPlaying: boolean;
  time: Date;
  driverList: DriverTimingList[];
  minute: number;
  wasPlaying: boolean;

  setTime: (time: Date) => void;
  toggleIsPlaying: () => void;
  setDriverList: (driverList: DriverTimingList[]) => void;
  setMinute: (minute: number) => void;
  setWasPlaying: (wasPlaying: boolean) => void;
};

export const store = create<State>((set) => ({
  isPlaying: false,
  time: new Date(),
  driverList: [],
  minute: 0,
  wasPlaying: false,

  setTime: (time: Date) => set({ time }),
  toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setWasPlaying: (wasPlaying: boolean) => set({ wasPlaying }),
  setDriverList: (driverList: DriverTimingList[]) => set({ driverList }),
  setMinute: (minute: number) => set({ minute }),
}));
