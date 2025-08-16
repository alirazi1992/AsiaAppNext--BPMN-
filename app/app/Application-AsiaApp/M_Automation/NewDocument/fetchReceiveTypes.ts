import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetReceiveTypes from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetReceiveTypes";

export const useReceiveTypes = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetReceiveTypes()
    const fetchReceiveTypes = async (docTypeId: string) => {
        try {
            const response = await Function(docTypeId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.status &&response.data.data && response.data.data.length >= 0) {
                return response.data.data.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        isDefault: item.isDefault,
                        faTitle: item.faTitle,
                        label: item.faTitle,
                        value: item.id
                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Receivers List",
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
    return { fetchReceiveTypes };
};