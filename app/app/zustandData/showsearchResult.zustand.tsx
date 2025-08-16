import {create} from 'zustand';
export interface StoreState {

  ShowTable : boolean;
  setState: (newState: any) => void;
}
const useStore = create<StoreState>((set) => ({

  ShowTable : false, 
  setState: (newState) => set((state) => ({
    ...state,
    ShowTable : newState.ShowTable || state.ShowTable,
  })),
}));

export default useStore;