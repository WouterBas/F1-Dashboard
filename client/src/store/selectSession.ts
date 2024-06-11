import { create } from "zustand";

type State = {
  selected: {
    year: string;
    gp: string;
    type: string;
  };

  setSelected: (selected: State["selected"]) => void;
};

export const selectSession = create<State>((set) => ({
  selected: {
    year: "2024",
    gp: "Bahrain Grand Prix",
    type: "Race",
  },
  availableGpState: [],
  availableTypesState: [],

  setSelected: (selected: State["selected"]) => set({ selected }),
}));
