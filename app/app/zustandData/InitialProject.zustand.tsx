import { create } from 'zustand';
import { JobOptionProps, WorkOrderOptionProps, CustomerOptionProps } from '../models/ProjectManagement/InitialProjectModels';

export interface InitialProjectStoreModel {
  RelatedJobs: JobOptionProps[],
  SelectedJobId: number | null,
  SelectedCustomer: CustomerOptionProps | null,
  RelatedWorkOrders: WorkOrderOptionProps[],
  SelectedCustomerId: number | null
  setState: (newState: any) => void;
}

const useStore = create<InitialProjectStoreModel>((set) => ({
  RelatedJobs: [],
  SelectedJobId: null,
  SelectedCustomer: null,
  RelatedWorkOrders: [],
  SelectedCustomerId: null,
  setState: (newState: InitialProjectStoreModel) => set((state) => ({
    RelatedJobs: newState.RelatedJobs || state.RelatedJobs,
    SelectedCustomer: newState.SelectedCustomer || state.SelectedCustomer,
    RelatedWorkOrders: newState.RelatedWorkOrders || state.RelatedWorkOrders,
    SelectedJobId: newState.SelectedJobId || state.SelectedJobId,
    SelectedCustomerId: newState.SelectedCustomerId || state.SelectedCustomerId
  })),
}));

export default useStore;