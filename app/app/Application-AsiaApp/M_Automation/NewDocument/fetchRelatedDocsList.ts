
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetRelatedDocslist from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetRelatedDocsList";

export const useRelatedDocs = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetRelatedDocslist()
    const fetchRelatedDocsList = async (docheapId: string) => {
        try {
            const response = await Function(docheapId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data && response.data.status == true) {
                return response.data.data
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Related Docs List",
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
    return { fetchRelatedDocsList };
};