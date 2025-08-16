'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { UpdateArchiveModel } from "@/app/Domain/M_History/Archive";
import UpdateHArchiveDoc from "@/app/Servises-AsiaApp/M_History/UpdateHArchive";

export const UpdatingHArchive = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = UpdateHArchiveDoc()
    const updateHArchive = async (dataItems: UpdateArchiveModel) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Update History Archive!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Update it!"
        })
        if (result.isConfirmed) {
            const response = await Function(dataItems);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if ( response.data.data && response.data.status) {
                    return response.data.data
                } else {
                    return Swal.fire({
                        background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Update History Archive!",
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
    return { updateHArchive };
}