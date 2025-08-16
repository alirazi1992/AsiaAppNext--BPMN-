import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AddDocArchive from "@/app/Servises-AsiaApp/M_Automation/NewDocument/AddDocArchive";

export const InsertingDocArchive = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AddDocArchive()
    const InsertDocument = async (docheapId: string, id: number, name: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Add document to archives!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add it!"
        })
        if (result.isConfirmed) {
            const response = await Function(docheapId, id, name);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                } else {
                    if ( response.data.status && response.data.data != null) {
                        return response.data.data
                    } else {
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Add document to archives",
                            text: response.data.message,
                            icon: response.data.status ? "warning" : "error",
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
    return { InsertDocument };
}