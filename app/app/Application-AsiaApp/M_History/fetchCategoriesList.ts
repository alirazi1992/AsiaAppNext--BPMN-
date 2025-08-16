import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetCategoriesList from "@/app/Servises-AsiaApp/M_History/GetCategories";

export const useList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetCategoriesList()
    const fetchCategoriesList = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return response.data.message
            }else{
            if ( response.data.data && response.data.status == true) {
                return response.data.data.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        faTitle: item.faTitle,
                        label: item.faTitle,
                        value: item.id
                    }
                })
            } else {
                const res = Swal.fire({
                    background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Categories list",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
                return res
            }}
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchCategoriesList };
};