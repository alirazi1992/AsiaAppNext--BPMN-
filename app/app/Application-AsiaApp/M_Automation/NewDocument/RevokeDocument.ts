

'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import RevokeDoc from "@/app/Servises-AsiaApp/M_Automation/NewDocument/RevokeDocument";
export const RevokeDocs = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = RevokeDoc()
    const RevokeDocument = async (docTypeId: string, docheapId: string, description: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Revoke Document!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, revoke it!"
        })
        if (result.isConfirmed) {
            const response = await Function(docTypeId, docheapId, description);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if (response.status !== 401 && response.data.status == true && response.data.data > 0) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Revoke Document!",
                        text: response.data.message,
                        icon: response.data.data == 0 && response.data.status ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }}
            }
        } else {
            const res = 'dissmiss'
            return res
        }
    }
    return { RevokeDocument };
}