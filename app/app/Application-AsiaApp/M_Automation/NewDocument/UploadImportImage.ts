'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { UploadFilesModel } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import SaveMainImage from "@/app/Servises-AsiaApp/M_Automation/NewDocument/SavemainImage";

export const useUploadImage = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = SaveMainImage()
    const UploadImportImage = async (file: UploadFilesModel, docheapId: string, docTypeId: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'Save Main Image',
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        })
        if (result.isConfirmed) {
            const response = await Function(file, docheapId, docTypeId);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.data !== null && response.data.status) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'Save Main Image',
                        text: response.data.message,
                        icon: response.data.status == true ? "warning" : 'error',
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
    return { UploadImportImage };
}
