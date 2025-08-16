
import { create  } from "zustand";
type Store = {
    username : string;
    password : string; 
    currentPassword : string; 
    newPassword : string ; 
    confirmPassword : string ;
    changeUsername : (e: React.ChangeEvent<HTMLInputElement>) => void; 
    changePassword : (e: React.ChangeEvent<HTMLInputElement>) => void;
    changeCurrentPassword : (e: React.ChangeEvent<HTMLInputElement>) => void;
    changeNewPassword : (e: React.ChangeEvent<HTMLInputElement>) => void;
    changeConfirmPassword : (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const useStore = create<Store>((set) => ({
      username: "",
      password: "",
      currentPassword : "" , 
      newPassword : "", 
      confirmPassword : "", 
      changeUsername :(e) => set((state) => ({ 
      username: state.username === "" ? e.target.value : e.target.value })) , 
      changePassword :(e) => set((state) => ({ 
      password: state.password === "" ? e.target.value : e.target.value })) ,
      changeCurrentPassword :(e) => set((state) => ({ 
      password: state.currentPassword === "" ? e.target.value : e.target.value })) ,
      changeNewPassword :(e) => set((state) => ({ 
      password: state.newPassword === "" ? e.target.value : e.target.value })) ,
      changeConfirmPassword :(e) => set((state) => ({ 
      password: state.confirmPassword === "" ? e.target.value : e.target.value })) ,
  }));
export default useStore;
