import { CircuitDimensions, DriverTimingList } from "@/types";
import { createStore } from "zustand";
import { createContext } from "react";

type AppProps = {
  isPlaying: boolean;
  time: Date;
  driverList: DriverTimingList[];
  minute: number;
  wasPlaying: boolean;
  speed: number;
  trackStatus: string;
  showLabels: boolean;
  circuitDimensions: CircuitDimensions;
};

interface AppState extends AppProps {
  setTime: (time: Date) => void;
  toggleIsPlaying: () => void;
  setDriverList: (driverList: DriverTimingList[]) => void;
  setMinute: (minute: number) => void;
  setWasPlaying: (wasPlaying: boolean) => void;
  setSpeed: (speed: number) => void;
  setTrackStatus: (trackStatus: string) => void;
  toggleShowLabels: () => void;
  setCircuitDimensions: (CircuitDimensions: CircuitDimensions) => void;
}

export type AppStore = ReturnType<typeof createAppStore>;

export const createAppStore = (initProps?: Partial<AppProps>) => {
  const DEFAULT_PROPS: AppProps = {
    isPlaying: false,
    time: new Date("1970-01-01T00:00:00.000Z"),
    driverList: [],
    minute: 0,
    wasPlaying: false,
    speed: 1,
    trackStatus: "Started",
    showLabels: true,
    circuitDimensions: {
      calcWidth: 0,
      calcHeight: 0,
      scale: 1,
      minX: 0,
      minY: 0,
    },
  };
  return createStore<AppState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setTime: (time: Date) => set({ time }),
    toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setWasPlaying: (wasPlaying: boolean) => set({ wasPlaying }),
    setDriverList: (driverList: DriverTimingList[]) => set({ driverList }),
    setMinute: (minute: number) => set({ minute }),
    setSpeed: (speed: number) => set({ speed }),
    setTrackStatus: (trackStatus: string) => set({ trackStatus }),
    toggleShowLabels: () => set((state) => ({ showLabels: !state.showLabels })),
    setCircuitDimensions: (circuitDimensions: CircuitDimensions) =>
      set({ circuitDimensions }),
  }));
};

export const AppContext = createContext<AppStore | null>(null);
