import { create } from "zustand";

type State = {
  isPlaying: boolean;
  time: Date;
  setTime: (time: Date) => void;

  toggleIsPlaying: () => void;
};

export const store = create<State>((set) => ({
  isPlaying: false,
  time: new Date(),

  setTime: (time: Date) => set({ time }),

  toggleIsPlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
