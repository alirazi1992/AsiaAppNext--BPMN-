

'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import RemoveRelation from "@/app/Servises-AsiaApp/M_Automation/NewDocument/DeleteRelation";
export const RemovingRelation = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = RemoveRelation()
    const RemoveRelationfromList = async (id: number, docheapId: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Remove paraph from list!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        })
        if (result.isConfirmed) {
            const response = await Function(id, docheapId);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.data && response.data.status) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Remove paraph from list!",
                        text: response.data.message,
                        icon: response.data.data == false && response.data.status == true ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }}
            }
        } else {
            const res = 'dissmiss'
            return res
        }
    }
    return { RemoveRelationfromList };
}