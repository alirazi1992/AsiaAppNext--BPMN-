'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import UnSignDocument from "@/app/Servises-AsiaApp/M_Automation/NewDocument/UnSignDocument";
import SignDocument from "@/app/Servises-AsiaApp/M_Automation/NewDocument/SignDocument";

export const RemovingSignerfromList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = UnSignDocument()
    const RemoveSigner = async (signatureId: number, docheapId: string, docTypeId: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "حذف امضاء کننده",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        })
        if (result.isConfirmed) {
            const response = await Function(signatureId, docheapId, docTypeId);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.data !== null) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "حذف امضاء کننده",
                        text: response.data.message,
                        icon: response.data.status == true ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }}
            }
        } else {
            const res = 'dissmiss';
            return res
        }
    }
    return { RemoveSigner };
}
export const useSignDocument = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = SignDocument()
    const SignDoc = async (docheapId: string, docTypeId: string, forwardParentId: number) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'امضاء مدرک',
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        })
        if (result.isConfirmed) {
            const response = await Function(docheapId, docTypeId, forwardParentId);
            if (response) {
                if (response.data.data !== null && response.data.status) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'امضاء مدرک',
                        text: response.data.message,
                        icon: response.data.status == true ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }
            }
        } else {
            const res = 'dissmiss'
            return res
        }
    }
    return { SignDoc };
}