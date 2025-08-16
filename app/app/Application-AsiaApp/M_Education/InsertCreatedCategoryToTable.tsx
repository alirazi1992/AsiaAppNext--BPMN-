import AddCourseCategory from "@/app/Servises-AsiaApp/M_Education/AddCourseCategory";
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import { CategoryItemsModel } from "@/app/Domain/M_Education/Categories";

export const InsertingCategory = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AddCourseCategory()
    const AddCategories = async (dataItems: CategoryItemsModel) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Add Category!",
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
                } else {
                    if (response.data.status && response.data.data != null) {
                        return response.data.data
                    } else {
                        Swal.fire({
                            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                            allowOutsideClick: false,
                            title: "Add Category",
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
    return { AddCategories };
}