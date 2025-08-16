'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import UnArchiveDocument from "@/app/Servises-AsiaApp/M_Automation/NewDocument/UnArchiveDocument";

export const RemovingArchive = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = UnArchiveDocument()
    const UnArchive = async (docheapId: string, id: number,) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "unArchive document!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Remove it!"
        })
        if (result.isConfirmed) {
            const response = await Function(docheapId, id);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                } else {
                    if ( typeof response.data.data === 'object' && response.data.status == true) {
                        return response.data.data
                    } else {
                        const res = Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "unArchive document!",
                            text: response.data.message,
                            icon: response.data.status == true ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "Ok!"
                        })
                        return res
                    }
                }
            }
        } else {
            const res = 'dissmiss'
            return res
        }
    }
    return { UnArchive };
}