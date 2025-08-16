import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
  stateMode: boolean;
  mode: string;
  changeMode(): void | null;
  getState(): any;
};

const useStore = create<Store>()(
  persist(
    (set, get) => ({
      stateMode: true,
      mode: "bi bi-sun",
      changeMode: (() => {
        set((state) => ({
          stateMode: (state.stateMode == true) ? false : true,
          mode: (state.mode == "bi bi-sun") ? "bi bi-moon" : "bi bi-sun"
        }));
      }),
      getState: (() => {
        return {
          stateMode: true,
          mode: "bi bi-sun",
        }
      })
    }),
    {
      name: "theme-store",
    }
  )
);

export default useStore;

