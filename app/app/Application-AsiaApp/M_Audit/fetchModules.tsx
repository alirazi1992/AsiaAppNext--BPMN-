import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";;
import { GetModulesModel } from "@/app/Domain/M_Audit/logTable";
import GetModules from "@/app/Servises-AsiaApp/M_Audit/GetModules";

export const useAuditModules = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetModules();
    const fetchModules = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return 'UnAuthorized'
            }else{
            if ( response.data.length >= 0) {
                return response.data.map((item: GetModulesModel) => {
                    return {
                        id: item.id,
                        label: item.title,
                        title: item.title,
                        value: item.id
                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Modules",
                    // text: response.data.message,
                    icon: response.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchModules };
};