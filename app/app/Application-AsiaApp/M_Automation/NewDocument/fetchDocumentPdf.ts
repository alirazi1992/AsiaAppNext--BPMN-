import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetPdf from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetPdf";

export const usePdf = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetPdf();
    const fetchDocumentPdf = async (docheapId: string, templateId: number, docTypeId: string) => {
        try {
            const response = await Function(docheapId, templateId, docTypeId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data != null) {
                return response.data.data
            } else {
                const res = Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Pdf of document",
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
    return { fetchDocumentPdf };
};