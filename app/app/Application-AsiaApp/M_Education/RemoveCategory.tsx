'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import RemoveCourseCategory from "@/app/Servises-AsiaApp/M_Education/DeleteCategory";

export const RemovingCategoryFromList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = RemoveCourseCategory()
    const RemoveCategory = async (id: number) => {
        const response = await Function(id);
        if (response) {
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data) {
                return response.data.data
            } else {
                return Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Remove Category!",
                    text: response.data.message,
                    icon: response.data.data == false && response.data.status == true ? "warning" : 'error',
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        }
    }
    return { RemoveCategory };
}