import { create } from "zustand";

interface MediaState {
  isPlaying: boolean;
  setIsPlaying: () => void;
  setNotPlaying: () => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  isPlaying: false,
  setIsPlaying: () => set({ isPlaying: true }),
  setNotPlaying: () => set({ isPlaying: false }),
}));
