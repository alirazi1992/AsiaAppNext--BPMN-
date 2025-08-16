import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AddEducationaCourse from "@/app/Servises-AsiaApp/M_Education/AddEducationalCourse";
import { CourseItemsModel } from "@/app/Domain/M_Education/Courses";

export const InsertingCourse = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AddEducationaCourse()
    const AddCourses = async (dataItems: CourseItemsModel) => {
        const response = await Function(dataItems);
        if (response) {
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.data.status && response.data.data != null) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Add Course",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        }
    }
    return { AddCourses };
}