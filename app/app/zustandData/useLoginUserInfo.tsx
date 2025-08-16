import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ActorsModel } from "../models/Home/model";

interface StoreState {
  userInfo: LoggedInUserInfo | null;
  setData: (newData: any) => void;
}

const initialState: StoreState = {
  userInfo: null,
  setData: () => {
    {
    }
  },
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      ...initialState,
      setData: (newData) => {
        set((state) => ({
          ...state,
          userInfo: newData,
        }));
      },
    }),
    {
      name: "userInfo-storage",
    }
  )
);

export default useStore;

export type LoggedInUserInfo = {
  profilePicture: string;
  actors?: Array<ActorsModel>;
  activeRole?: string;
};
