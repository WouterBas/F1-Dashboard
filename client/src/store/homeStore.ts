import { createStore } from "zustand";
import { createContext } from "react";

type HomeProps = {
  selected: {
    year: string;
    gp: string;
    type: string;
  };
};

interface HomeState extends HomeProps {
  setSelected: (selected: HomeProps["selected"]) => void;
}

export type HomeStore = ReturnType<typeof createHomeStore>;

export const createHomeStore = (initProps?: Partial<HomeProps>) => {
  const DEFAULT_PROPS: HomeProps = {
    selected: {
      year: "2024",
      gp: "Bahrain Grand Prix",
      type: "Race",
    },
  };
  return createStore<HomeState>()((set) => ({
    ...DEFAULT_PROPS,
    ...initProps,
    setSelected: (selected: HomeState["selected"]) => set({ selected }),
  }));
};

export const HomeContext = createContext<HomeStore | null>(null);
