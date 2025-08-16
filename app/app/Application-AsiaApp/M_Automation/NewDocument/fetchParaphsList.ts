
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetParaphslist from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetParaphsList";

export const useParaphList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetParaphslist()
    const fetchParaphList = async (docheapId: string) => {
        try {
            const response = await Function(docheapId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.status &&response.data.data && response.data.data.length >= 0) {
                return response.data.data
            } else {
                const res = Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Paraph List",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
                return res
            }}
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchParaphList };
};