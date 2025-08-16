'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import SubmitDocument from "@/app/Servises-AsiaApp/M_Automation/NewDocument/SubmitDocument";

export const Douments = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = SubmitDocument()
    const SubmitDocuments = async (docheapId: string, submitDate: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'ثبت صادره مدرک',
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        })
        if (result.isConfirmed) {
            const response = await Function(docheapId, submitDate);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.data !== null && response.data.status) {
                    return response.data.data
                } else {
                   await Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'ثبت صادره مدرک',
                        text: response.data.message,
                        icon: response.data.status == true ? "warning" : 'error',
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
    return { SubmitDocuments };
}