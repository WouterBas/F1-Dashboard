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
    circuitKey: 147,
    sessionKey: 6397,
    driverKey: 3,
  },
  closed: false,
  points: true,
  startTime: new Date("2021-05-02T14:00:00.000Z"),
  duration: 60000,
  saved: false,
  angle: 0,

  setSelected: (selected: State["selected"]) => set({ selected }),
  setClosed: () => set((state) => ({ closed: !state.closed })),
  setPoints: () => set((state) => ({ points: !state.points })),
  setDuration: (duration: number) => set({ duration }),
  setStartTime: (startTime: Date) => set({ startTime }),
  setSaved: (saved: boolean) => set({ saved }),
  setAngle: (angle: number) => set({ angle }),
}));
