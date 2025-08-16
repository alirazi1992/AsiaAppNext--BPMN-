import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetJobBranchesList from "@/app/Servises-AsiaApp/M_HumanResources/GetJobBranchesList";
import { GetJobBrancheslistModel } from "@/app/Domain/M_HumanRecourse/ManageResume";

export const useJobBranches = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetJobBranchesList()
    const fetchJobBranchesList = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data.length >= 0) {
                return response.data.data.map((item: GetJobBrancheslistModel) => {
                    return {
                        id: item.id,
                        title: item.title,
                        faTitle: item.faTitle,
                        value: item.id,
                        label: item.faTitle

                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Job branches list",
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
    return { fetchJobBranchesList };
};