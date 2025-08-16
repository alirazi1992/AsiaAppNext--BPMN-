import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetFieldRepository from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetFieldRepository";

export const useFields = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetFieldRepository();
    const fetchFieldRepository = async (fieldId: number) => {
        try {
            const response = await Function(fieldId);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.status && response.data.data && response.data.data.length >= 0) {
                return response.data.data.map((item) => {
                    return {
                        Id: item.Id,
                        Value: item.Value,
                        value: item.Id,
                        label: item.Value
                    }
                })
            } else {
                const res = Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Field Repository",
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
    return { fetchFieldRepository };
};