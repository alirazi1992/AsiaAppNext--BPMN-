import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import SearchArchive from "@/app/Servises-AsiaApp/M_History/SearchArchive";

export const useArchive = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = SearchArchive()
    const fetchHArchive = async (page: number, items: any) => {
        try {
            const response = await Function(page, items);
            if (response.status == 401) {
                return response.data.message
            }else{
            if ( response.data.data !== null && response.data.status == true) {
                return response.data.data
            } else {
                const res = Swal.fire({
                    background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Archives",
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
    return { fetchHArchive };
};