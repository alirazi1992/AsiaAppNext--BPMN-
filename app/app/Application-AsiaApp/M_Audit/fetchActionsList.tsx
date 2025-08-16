import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";;
import { GetActionsModel } from "@/app/Domain/M_Audit/logTable";
import GetActionList from "@/app/Servises-AsiaApp/M_Audit/GetActionList";

export const useAuditActionList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetActionList();
    const fetchActionList = async (id: number) => {
        try {
            const response = await Function(id);
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.status !== 401 && response.data.data != null) {
                    return response.data.data.map((item: GetActionsModel) => {
                        return {
                            id: item.id,
                            name: item.name,
                            codeSourceId: item.codeSourceId,
                            label: item.name,
                            value: item.id
                        }
                    })
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get ActionList",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchActionList };
};