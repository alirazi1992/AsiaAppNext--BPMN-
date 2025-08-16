import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetPersonnelWorkPermitsInitial from "@/app/Servises-AsiaApp/M_Automation/GetPersonnelWorkPermitsInitial";

export const usePermits = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetPersonnelWorkPermitsInitial()
    const fetchPersonnelWorkPermits = async (id: number) => {
        try {
            const response = await Function(id);
            if (response.status == 401) {
                return response.data.message
            }else{
            if ( response.data.status && response.data.data !== null) {
                return response.data.data
            } else {
                Swal.fire({
                    background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Personnel Work Permits",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchPersonnelWorkPermits };
};