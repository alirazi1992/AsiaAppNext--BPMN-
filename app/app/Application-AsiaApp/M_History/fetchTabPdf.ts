import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetTabPdf from "@/app/Servises-AsiaApp/M_History/GetTabPDF";

export const useTab = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetTabPdf()
    const fetchPdfData = async (id: number) => {
        try {
            const response = await Function(id);
            if (response.status == 401) {
                return response.data.message
            } else {
                if (typeof response.data.data == 'string' && response.data.status == true) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get Tab Pdf",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
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
    return { fetchPdfData };
};