
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetToolbars from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetToolbar";

export const useToolbars = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetToolbars()
    const fetchToolbars = async (docheapId: string) => {
        try {
            const response = await Function(docheapId);
            if (response) {
                if (response.status == 401) {
                    return response.data.message
                }else{
                if (response.data.data && response.data.status) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get Toolbars",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }}
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchToolbars };
};