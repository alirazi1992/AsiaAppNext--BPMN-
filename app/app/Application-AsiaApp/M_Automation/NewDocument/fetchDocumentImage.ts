
import GetPdf from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetPdf";
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand'
import useStore from "@/app/hooks/useStore";

export const useDocumentImage = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetPdf();
    const fetchPdf = async (docheapId: string, templateId: number, docTypeId: string = '1') => {
        try {
            const response = await Function(docheapId, templateId, docTypeId);
             if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.status == true) {
                return response.data.data
            } else {
                const res = Swal.fire({
                    background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get import image",
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
    };
    return { fetchPdf };
};

