import { DriverTimingList } from "@/types";
import { create } from "zustand";

type State = {
  isPlaying: boolean;
  time: Date;
  driverList: DriverTimingList[];
  minute: number;
  wasPlaying: boolean;
  speed: number;
  trackStatus: string;
  showLabels: boolean;

  setTime: (time: Date) => void;
  toggleIsPlaying: () => void;
  setDriverList: (driverList: DriverTimingList[]) => void;
  setMinute: (minute: number) => void;
  setWasPlaying: (wasPlaying: boolean) => void;
  setSpeed: (speed: number) => void;
  setTrackStatus: (trackStatus: string) => void;
  toggleShowLabels: () => void;
};

export const useAppStore = create<State>((set) => ({
  isPlaying: false,
  time: new Date("1970-01-01T00:00:00.000Z"),
  driverList: [],
  minute: 0,
  wasPlaying: false,
  speed: 1,
  trackStatus: "Started",
  showLabels: true,

  setTime: (time: Date) => set({ time }),
  toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setWasPlaying: (wasPlaying: boolean) => set({ wasPlaying }),
  setDriverList: (driverList: DriverTimingList[]) => set({ driverList }),
  setMinute: (minute: number) => set({ minute }),
  setSpeed: (speed: number) => set({ speed }),
  setTrackStatus: (trackStatus: string) => set({ trackStatus }),
  toggleShowLabels: () => set((state) => ({ showLabels: !state.showLabels })),
}));
