
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
type Store = {
  color: string | undefined | any;
  changeColor: (inputColor:string) => void;
};

const useStore = create<Store>()(
  persist(
    (set) => ({
      color: '#748aaf',
      changeColor: (inputColor:string) => {
        const newColor = inputColor;
        set((state) => ({
          ...state,
          color: newColor,
        }));
      },
    }), {
    name: "color-store"
  })
);
export default useStore;