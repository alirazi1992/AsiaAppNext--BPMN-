
import GetCourseCategories from "@/app/Servises-AsiaApp/M_Education/GetCourseCategories";
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetCategoriesList from "@/app/Servises-AsiaApp/M_Education/GetCategoriesList";
import { GetCategoriesListModel } from "@/app/Domain/M_Education/Courses";

export const useCategories = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetCourseCategories()
    const fetchCategories = async (searchKey: string = '', page: number = 1) => {
        try {
            const response = await Function(searchKey, page);
            if (response.status == 401) {
                return response.data.message
            }else{
            if ( response.data.data != null) {
                return response.data.data;
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "GetCourseCategories",
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
    return { fetchCategories };
};

export const useCategoriesList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetCategoriesList()
    const fetchCategoriesList = async () => {
        try {
            const response = await Function();
            if (response.data.data != null) {
                return response.data.data.map((item: GetCategoriesListModel) => {
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
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Course Categories",
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
    return { fetchCategoriesList };
};