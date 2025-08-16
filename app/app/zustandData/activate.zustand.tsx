

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type Store = {
  activate: string;
  activeSubLink: string | null;
  activeSubMenu: string | null;
  setState: (newState: any) => void;
};
const useStore = create<Store>()(
  persist(
    (set) => ({
      activate: "",
      activeSubLink: "",
      activeSubMenu: '',
      setState: (newState) => set((state) => ({
        ...state,
        activate: newState.activate || state.activate,
        activeSubLink: newState.activeSubLink || state.activeSubLink,
        activeSubMenu: newState.activeSubMenu,
      })),
    }),
    {
      name: "activateTab-store"
    }
  ));

export default useStore;

