
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetDocKeywordsList from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetDockeywordslist";
import GetKeywordsList from "@/app/Servises-AsiaApp/M_Automation/NewDocument/Getkeywordslist";

export const useDocKeywords = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetDocKeywordsList()
    const fetchDocKeywords = async (docheapId: string) => {
        try {
            const response = await Function(docheapId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.status && response.data.data !== null) {
                return response.data.data.map((item) => {
                    return {
                        id: item.id,
                        label: item.title,
                        title: item.title,
                        value: item.id
                    }
                })
            } else {
                Swal.fire({
                    background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get document Keywords",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        } catch (error) {
            
            console.error('Error fetching document keywords:', error);
        }
    }
    return { fetchDocKeywords };
};
export const useKeywordsList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetKeywordsList()
    const fetchKeywords = async (searchkey: string) => {
        try {
            const response = await Function(searchkey);
            if (response.data.status && response.data.data !== null) {
                return response.data.data.map((item) => {
                    return {
                        id: item.id,
                        label: item.title,
                        title: item.title,
                        value: item.id
                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Keywords List",
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
    return { fetchKeywords };
};
