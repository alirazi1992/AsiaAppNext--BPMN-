import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetPrograms from "@/app/Servises-AsiaApp/M_Education/GetEducationaCoursePrograms";
import { SearchProgramModel } from "@/app/Domain/M_Education/Programs";

export const usePrograms = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetPrograms()
    const fetchCoursePrograms = async (searchKey: SearchProgramModel, page: number = 1) => {
        try {
            const response = await Function(searchKey, page);
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
                        title: "Get Educational CoursePrograms",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchCoursePrograms };
};