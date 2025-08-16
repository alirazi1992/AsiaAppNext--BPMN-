'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import UploadListofAttachments from "@/app/Servises-AsiaApp/M_Automation/NewDocument/UploadListOfAttachment";
import { UploadFilesModel } from "@/app/Domain/M_Automation/NewDocument/Attachments";

export const ListAttachments = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = UploadListofAttachments()
    const UploadListAttachments = async (docheapId: string, docTypeId: string, UploadFiles: UploadFilesModel[]) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: 'Upload List of Attachments',
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes!"
        })
        if (result.isConfirmed) {
            const response = await Function(docheapId, docTypeId, UploadFiles);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.status && response.data.data && response.data.data.length > 0) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'Upload List of Attachments',
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
    return { UploadListAttachments };
}
