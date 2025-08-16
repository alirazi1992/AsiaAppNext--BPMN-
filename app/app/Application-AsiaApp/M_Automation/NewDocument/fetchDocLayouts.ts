import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetDocLayoutssize from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetDocLayouts";

export const useLayouts = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetDocLayoutssize();
    const fetchDocLayoutes = async (docTypeId: string) => {
        try {
            const response = await Function(docTypeId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data && response.data.status) {
                return response.data.data
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Document Layoutes",
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
    return { fetchDocLayoutes };
};