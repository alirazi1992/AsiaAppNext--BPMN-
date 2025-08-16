import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetArchiveHierarchy from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetArchiveHierarchy";

export const useArchiveHierarchy = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetArchiveHierarchy();
    const fetchArchiveHierarchy = async (docheapId: string) => {
        try {
            const response = await Function(docheapId);
            if (response.status == 401) {
                return response.data.Message
            }else{
            if (response.data.Data.length >= 0 && response.data.Status) {
                return response.data.Data
            } else {
                const res = Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Archive Hierarchy",
                    text: response.data.Message,
                    icon: response.data.Status ? "warning" : "error",
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
    return { fetchArchiveHierarchy };
};