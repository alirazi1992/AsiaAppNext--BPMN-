import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";;
import { AuditItemsModel } from "@/app/Domain/M_Audit/logTable";
import GetLogs from "@/app/Servises-AsiaApp/M_Audit/GetLogs";

export const useAuditLogs = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetLogs();
    const fetchLogs = async (page: number = 1, item: AuditItemsModel) => {
        try {
            const response = await Function(page, item);
            if (response.status == 401) {
                return 'UnAuthorized'
            } else {
                if ( response.data.data !== null) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get Logs",
                        text: response.data.message,
                        icon: response.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchLogs };
};