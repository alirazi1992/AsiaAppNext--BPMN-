'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import RemoveUserSignature from "@/app/Servises-AsiaApp/M_HumanResources/DeleteUserSignature";

export const RemovingSignatureFromList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = RemoveUserSignature()
    const RemoveSignature = async (id: number) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Remove Signature from list!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Remove it!"
        })
        if (result.isConfirmed) {
            const response = await Function(id);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                } else {
                    if (response.data.status && response.data.data == id) {
                        return response.data.data
                    } else {
                        return Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Remove Signature from list!",
                            text: response.data.message,
                            icon: response.data.data == 0 && response.data.status == true ? "warning" : 'error',
                            confirmButtonColor: "#22c55e",
                            confirmButtonText: "Ok!"
                        })
                    }
                }
            }
        } else {
            const res = 'dissmiss'
            return res
        }
    }
    return { RemoveSignature };
}