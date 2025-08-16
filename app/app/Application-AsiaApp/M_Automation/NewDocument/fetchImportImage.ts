
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
// import GetKeywordsList from "@/app/Servises-AsiaApp/M_Automation/NewDocument/Getkeywordslist";
import GetImportImage from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetImportImage";

export const useImportImage = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetImportImage()
    const fetchImportImage = async (docheapId: string) => {
        try {
            const response = await Function(docheapId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.status &&response.data.data !== null) {
                return response.data.data
            } else {
                const res = Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Import Image",
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
    return { fetchImportImage };
};