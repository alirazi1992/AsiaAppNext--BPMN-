import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetOrganizationBranchesList from "@/app/Servises-AsiaApp/M_Timesheet/GetOrganizationBranchesList";
import { GetBranchListModel } from "../Utils/shared";

export const useBranchList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetOrganizationBranchesList();
    const fetchBranchList = async () => {
        try {
            const response = await Function();
            if (response.status && Array.isArray(response.data.data) && response.data.data.length > 0) {
                return response.data.data.map((item: GetBranchListModel) => {
                    return {
                        value: item.id,
                        label: item.faTitle,
                        id: item.id,
                        faName: item.faName,
                        faTitle: item.faTitle,
                        name: item.name,
                        title: item.title,
                        isMain: item.isMain
                    }
                })
            } else {
                const res = Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get branchs list!",
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
    return { fetchBranchList };
};