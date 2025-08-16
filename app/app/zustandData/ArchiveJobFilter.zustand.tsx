import {create} from 'zustand';
import { ViewDocumentListTableModel } from '../models/Archive/ViewDocumentListTable';
interface StoreState {
  JobId: number;
  WorkOrderId: number;
  CategoryId: number;
  DocType: boolean;
  ViewDocumentList: ViewDocumentListTableModel[];
  ShowTable : boolean;
  setState: (newState: any) => void;
}
const useStore = create<StoreState>((set) => ({
  JobId: 0,
  WorkOrderId: 0,
  CategoryId: 0,
  DocType: false,
  ViewDocumentList: [],
  ShowTable : false, 
  setState: (newState) => set((state) => ({
    ...state,
    JobId: newState.JobId || state.JobId,
    WorkOrderId: newState.WorkOrderId || state.WorkOrderId,
    CategoryId: newState.CategoryId || state.CategoryId,
    DocType: newState.DocType || state.DocType,
    ViewDocumentList: newState.ViewDocumentList || state.ViewDocumentList,
    ShowTable : newState.ShowTable || state.ShowTable,

  })),
}));

export default useStore;