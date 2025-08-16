import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
    Unauthorized: boolean;
    changeState(): void | null;
    getState(): any;
};

const useStore = create<Store>()(
    persist(
        (set, get) => ({
            Unauthorized: false,
            changeState: (() => {
                set((state) => ({
                    Unauthorized: (state.Unauthorized == false) ? true : false
                }));
            }),
            getState: (() => {
                return {
                    Unauthorized: false,
                }
            })
        }),
        {
            name: "Authorization-store",
        }
    )
);

export default useStore;

