'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import UpdateEducationalCourse from "@/app/Servises-AsiaApp/M_Education/UpdateCourse";
import { CourseItemsModel } from "@/app/Domain/M_Education/Courses";

export const UpdatingEducationalCourse = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = UpdateEducationalCourse()
    const updateCourse = async (dataItems: CourseItemsModel) => {
        const response = await Function(dataItems);
        if (response) {
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.data.status && response.data.data) {
                    return response.data.data
                } else {
                    return Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Update Course!",
                        text: response.data.message,
                        icon: response.data.data == false && response.data.status == true ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        }
    }
    return { updateCourse };
}