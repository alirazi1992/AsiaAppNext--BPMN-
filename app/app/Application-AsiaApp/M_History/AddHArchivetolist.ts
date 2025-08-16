
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AddHArchiveDoc from "@/app/Servises-AsiaApp/M_History/AddArchive";
import { AddArchiveModel } from "@/app/Domain/M_History/Archive";


export const useHArchives = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AddHArchiveDoc()
    const AddArchiveDoc = async (dataItems: AddArchiveModel) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Add History!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add it!"
        })
        if (result.isConfirmed) {
            const response = await Function(dataItems);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if (response.data.data !== 0 && response.data.status) {
                    return response.data.data
                } else {
                   const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Add History Archive doument!",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
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
    return { AddArchiveDoc };
}