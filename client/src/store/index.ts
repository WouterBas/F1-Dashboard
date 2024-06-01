import { create } from "zustand";

type State = {
  isPlaying: boolean;
  time: Date;
  setTime: (time: Date) => void;

  setIsPlaying: () => void;
  setNotPlaying: () => void;
};

export const store = create<State>((set) => ({
  isPlaying: false,
  time: new Date(),

  setTime: (time: Date) => set({ time }),

  setIsPlaying: () => set({ isPlaying: true }),
  setNotPlaying: () => set({ isPlaying: false }),
}));
