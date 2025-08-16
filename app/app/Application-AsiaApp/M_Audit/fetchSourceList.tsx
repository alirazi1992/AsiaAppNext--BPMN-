import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";;
import GetSourceList from "@/app/Servises-AsiaApp/M_Audit/GetSourcesList";
import { GetSourceListModel } from "@/app/Domain/M_Audit/logTable";

export const useAuditSourseList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetSourceList();
    const fetchSourceList = async (id: number) => {
        try {
            const response = await Function(id);
            if (response.status == 401) {
                return response.data.message
            } else {
                if ( response.data.data.length >= 0) {
                    return response.data.data.map((item: GetSourceListModel) => {
                        return {
                            id: item.id,
                            label: item.title,
                            title: item.title,
                            value: item.value,
                            moduleId: item.moduleId
                        }
                    })
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get SourceList",
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
    return { fetchSourceList };
};