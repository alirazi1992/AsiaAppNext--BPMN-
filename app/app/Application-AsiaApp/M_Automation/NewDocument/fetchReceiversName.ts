
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import FilterReceiversName from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetReceiversList";

export const useList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = FilterReceiversName()
    const fetchReceiversList = async (searchKey: string, fieldId: number) => {
        try {
            if (searchKey && searchKey != null && searchKey.trim() != '') {
                const response = await Function(searchKey, fieldId);
                if (response.status == 401) {
                    return response.data.message
                }else{
                if (response.data.status &&response.data.data && response.data.data.length >= 0) {
                    return response.data.data.map((item) => {
                        return {
                            EnValue: item.EnValue,
                            Level: item.Level,
                            Id: item.Id,
                            Value: item.Value,
                            Name: item.Name,
                            FaName: item.FaName,
                            value: item.Id,
                            label: item.Value
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
            } else {
                return []
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchReceiversList };
};