
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { useCallback } from "react";
import GetNewDocumentData from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetNewDocument";

export const useNewDocumentData = () => {
    const themeMode = useStore(themeStore, (state) => state)?.stateMode
    const { Function } = GetNewDocumentData()
    const fetchNewDocumentData = async (docTypeId: string, draftId: string, layoutType: string) => {
        try {
            const response = await Function(docTypeId, draftId, layoutType);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.status &&response.data.data && response.data.data.length > 0) {
                return response.data.data
            } else {
                const res = Swal.fire({
                    background: themeMode == true ? "#22303c" : "#eee3d7",
                    color: themeMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get new document data",
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
    return { fetchNewDocumentData };
};
