import { create } from "zustand";

type State = {
  selected: {
    circuitKey: number;
    sessionKey: number;
    driverKey: number;
  };
  closed: boolean;
  points: boolean;
  startTime: Date;
  duration: number;
  saved: boolean;
  angle: number;

  setSelected: (selected: State["selected"]) => void;
  setClosed: () => void;
  setPoints: () => void;
  setDuration: (duration: number) => void;
  setStartTime: (startTime: Date) => void;
  setSaved: (saved: boolean) => void;
  setAngle: (angle: number) => void;
};

export const useAdminStore = create<State>((set) => ({
  selected: {
    circuitKey: 9,
    sessionKey: 9213,
    driverKey: 1,
  },
  closed: false,
  points: true,
  startTime: new Date("2023-10-22T19:33:11.000Z"),
  duration: 101000,
  saved: false,
  angle: 4,

  setSelected: (selected: State["selected"]) => set({ selected }),
  setClosed: () => set((state) => ({ closed: !state.closed })),
  setPoints: () => set((state) => ({ points: !state.points })),
  setDuration: (duration: number) => set({ duration }),
  setStartTime: (startTime: Date) => set({ startTime }),
  setSaved: (saved: boolean) => set({ saved }),
  setAngle: (angle: number) => set({ angle }),
}));
