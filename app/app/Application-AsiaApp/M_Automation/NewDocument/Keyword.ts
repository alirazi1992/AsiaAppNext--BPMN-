import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import SaveKeyword from "@/app/Servises-AsiaApp/M_Automation/NewDocument/SaveKeyword";
import DeleteKeyword from "@/app/Servises-AsiaApp/M_Automation/NewDocument/DeleteKeyword";

export const useSaveKeywords = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = SaveKeyword()
    const AddKeywordtoList = async (keyword: string, docheapId: string, docTypeId: string) => {
        try {
            const result = await Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "Save keyword",
                text: "Are you sure?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Add it!"
            })
            if (result.isConfirmed) {
                const response = await Function(keyword, docheapId, docTypeId);
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.status && response.data.data && response.data.data !== null) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Save keyword",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }}
            } else {
                const res = 'dissmiss'
                return res
            }

        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { AddKeywordtoList };
};

export const useRemoveKeywords = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = DeleteKeyword()
    const removeKeywordfromList = async (id: number, docheapId: string, docTypeId: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Remove keyword from list!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        })
        if (result.isConfirmed) {
            const response = await Function(id, docheapId, docTypeId);
            if (response) {
                if (response.data.data) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Remove keyword from list!",
                        text: response.data.message,
                        icon: response.data.status == true ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        } else {
            const res = 'dissmiss';
            return res
        }
    }
    return { removeKeywordfromList };
};