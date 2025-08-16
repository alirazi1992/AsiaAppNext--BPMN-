import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetGeneralTemplates from "@/app/Servises-AsiaApp/M_Education/GetGeneralTemplates";
import { GetGeneralTemplateModel } from "@/app/Domain/M_Education/Courses";

export const useCoursesTemplates = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetGeneralTemplates()
    const fetchTemplates = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return response.data.message
            }
            if ( response.data.data != null) {
                return response.data.data.map((item: GetGeneralTemplateModel) => {
                    return {
                        id: item.id,
                        value: item.id,
                        name: item.name,
                        label: item.name,
                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get General Templates",
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
    return { fetchTemplates };
};