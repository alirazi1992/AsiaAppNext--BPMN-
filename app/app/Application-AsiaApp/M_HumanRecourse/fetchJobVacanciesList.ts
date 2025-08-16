import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetJobVacanciesList from "@/app/Servises-AsiaApp/M_HumanResources/GetJobVacanciesList";
import { GetJobVacanciesListModel } from "@/app/Domain/M_HumanRecourse/ManageResume";

export const useJobVacancies = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetJobVacanciesList()
    const fetchJobVacancies = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data.length >= 0) {
                return response.data.data.map((item: GetJobVacanciesListModel) => {
                    return {
                        id: item.id,
                        title: item.title,
                        value: item.id,
                        label: item.title,
                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Job vacances list",
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
    return { fetchJobVacancies };
};