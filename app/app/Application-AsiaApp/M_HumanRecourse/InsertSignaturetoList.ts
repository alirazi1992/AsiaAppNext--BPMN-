import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AsignSignature from "@/app/Servises-AsiaApp/M_HumanResources/AsignSignature";

export const InsertingSignature = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AsignSignature()
    const AddSignaturetoList = async (title: string, file: string, fileType: string, userId: string) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Asign Signature!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add it!"
        })
        if (result.isConfirmed) {
            const response = await Function(title, file, fileType, userId);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                } else {
                    if (response.data.status && response.data.data != 0) {
                        return response.data.data
                    } else {
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Asign Signature!",
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
    return { AddSignaturetoList };
}