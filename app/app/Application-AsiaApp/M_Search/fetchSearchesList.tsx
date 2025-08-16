import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import SearchDocs from "@/app/Servises-AsiaApp/M_Search/SearchDocs";

export const useList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Search } = SearchDocs();
    const fetchSearchedList = async (list: string, page: number = 1) => {
        try {
            const response = await Search(list, page);
            if (response.status == 401) {
                return response.data.message
            }
            if (response.data.status && response.data.data.length > 0) {
                return response.data.data;
            } else {
                const res = Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Search Documents!",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
                return res
            }
        } catch (error) {
            const res = 'dissmiss'
            return res

        }
    }
    return { fetchSearchedList };
};