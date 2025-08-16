import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetEducationalCourses from "@/app/Servises-AsiaApp/M_Education/GetEducationalCourses";
import { GetCoursesListModel } from "@/app/Domain/M_Education/Programs";
import GetCoursesList from "@/app/Servises-AsiaApp/M_Education/GetCoursesList";

export const useCourses = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetEducationalCourses()
    const fetchCourses = async (searchKey: string = '', page: number = 1) => {
        try {
            const response = await Function(searchKey, page);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.status !== 401 && response.data.data != null) {
                return response.data.data
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Educational Courses",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchCourses };
};

export const useCoursesList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetCoursesList()
    const fetchCoursesList = async () => {
        try {
            const response = await Function();
            if (response.data.data != null) {
                return response.data.data.map((item: GetCoursesListModel) => {
                    return {
                        id: item.id,
                        value: item.id,
                        faName: item.faName,
                        name: item.name,
                        label: item.faName,
                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Courses",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchCoursesList };
};