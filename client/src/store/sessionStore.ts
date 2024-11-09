import { CircuitDimensions, DriverTimingList } from "@/types";
import { createStore } from "zustand";
import { createContext } from "react";

type SessionProps = {
  isPlaying: boolean;
  time: Date;
  driverList: DriverTimingList[];
  speed: number;
  trackStatus: string;
  showLabels: boolean;
  circuitDimensions: CircuitDimensions;

  startTime: Date;
  endTime: Date;

  minute: number;
};

interface SessionState extends SessionProps {
  setTime: (fn: (prev: Date) => Date) => void;
  toggleIsPlaying: () => void;
  setPlaying: (playing: boolean) => void;
  setDriverList: (driverList: DriverTimingList[]) => void;
  setSpeed: (speed: number) => void;
  setTrackStatus: (trackStatus: string) => void;
  toggleShowLabels: () => void;
  setCircuitDimensions: (CircuitDimensions: CircuitDimensions) => void;

  incrementTime: (minutes: number) => void;
  decrementTime: (minutes: number) => void;

  incrementSpeed: () => void;
  decrementSpeed: () => void;

  setMinute: (minute: number) => void;
}

export type SessionStore = ReturnType<typeof createSessionStore>;

export const createSessionStore = (initProps?: Partial<SessionProps>) => {
  const DEFAULT_PROPS: SessionProps = {
    isPlaying: false,
    time: new Date("1970-01-01T00:00:00.000Z"),
    driverList: [],
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

    startTime: new Date("1970-01-01T00:00:00.000Z"),
    endTime: new Date("1970-01-01T00:00:00.000Z"),
    minute: 0,
  };
  return createStore<SessionState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setTime: (fn: (prev: Date) => Date) =>
      set((state) => ({ time: fn(state.time) })),
    incrementTime: (minutes: number) =>
      set((state) => ({
        time:
          new Date(state.time.getTime() + minutes * 60 * 1000) < state.endTime
            ? new Date(state.time.getTime() + minutes * 60 * 1000)
            : state.endTime,
      })),
    setMinute: (minute: number) => set({ minute }),

    decrementTime: (minutes: number) =>
      set((state) => ({
        time:
          new Date(state.time.getTime() - minutes * 60 * 1000) > state.startTime
            ? new Date(state.time.getTime() - minutes * 60 * 1000)
            : state.startTime,
      })),
    toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
    setPlaying: (playing: boolean) => set({ isPlaying: playing }),
    setDriverList: (driverList: DriverTimingList[]) => set({ driverList }),
    setSpeed: (speed: number) => set({ speed }),
    incrementSpeed: () =>
      set((state) => ({
        speed: state.speed > 16 ? state.speed : state.speed * 2,
      })),
    decrementSpeed: () =>
      set((state) => ({
        speed: state.speed < 2 ? state.speed : state.speed / 2,
      })),
    setTrackStatus: (trackStatus: string) => set({ trackStatus }),
    toggleShowLabels: () => set((state) => ({ showLabels: !state.showLabels })),
    setCircuitDimensions: (circuitDimensions: CircuitDimensions) =>
      set({ circuitDimensions }),
  }));
};

export const sessionContext = createContext<SessionStore | null>(null);
