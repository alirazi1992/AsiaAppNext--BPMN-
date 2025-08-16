import { create } from "zustand";

type Store = {
    newRoleDate : string;
    newRoleTitle : string; 
    newRoleConvention : string; 
    newRoleRefrence : string; 
    newRoleOrigin : string;
    newRoleSummary : string; 
    newRoleContent : string; 
    changeDate : (e: React.ChangeEvent<HTMLInputElement>) => void; 
    changeTitle : (e: React.ChangeEvent<HTMLInputElement>) => void; 
    changeConvention : (e: React.ChangeEvent<HTMLInputElement>) => void; 
    changeRefrence : (e: React.ChangeEvent<HTMLInputElement>) => void; 
    changeOrigin : (e: React.ChangeEvent<HTMLInputElement>) => void; 
    // changeSummary : (e: ReactQuill.QuillEditorChange) => void; 
    // changeContent : (e: ReactQuill.QuillEditorChange) => void; 
}
const useStore = create<Store>((set) => ({
    newRoleDate: "",
    newRoleTitle: "",
    newRoleConvention: "",
    newRoleRefrence: "",
    newRoleOrigin: "",
    newRoleSummary: "", 
    newRoleContent : "", 
    changeDate: (e) => set((state) => ({ ...state, newRoleDate: e.target.value })),
    changeTitle: (e) => set((state) => ({ ...state, newRoleTitle: e.target.value })),
    changeConvention: (e) => set((state) => ({ ...state, newRoleConvention: e.target.value })),
    changeRefrence: (e) => set((state) => ({ ...state, newRoleRefrence: e.target.value })),
    changeOrigin: (e) => set((state) => ({ ...state, newRoleOrigin: e.target.value })),
    // changeSummary: (e) => set((state) => ({ ...state, newRoleSummary:  })),
    // changeContent: (e) => set((state) => ({ ...state, newRoleContent: e.target.value })),
   
  }));

export default useStore;


