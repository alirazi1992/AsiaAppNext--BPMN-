import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetSearchDocs from "@/app/Servises-AsiaApp/Shared/GetSearchDocs";

export const useDocs = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetSearchDocs();
    const fetchSearchDocs = async (searchKey: string = '', page: number = 1) => {
        try {
            const response = await Function(searchKey, page);
            if (response.data.data && response.data.status == true && response.data.data.docList.length > 0) {

                return response.data.data
            } else {
                const res = Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Docs List",
                    text: response.data.data && response.data.data.docList.length == 0 ? 'No items found.' : response.data.message,
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
    return { fetchSearchDocs };
};