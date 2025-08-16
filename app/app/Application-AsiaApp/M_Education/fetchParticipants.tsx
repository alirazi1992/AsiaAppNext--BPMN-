import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetProgramParticipants from "@/app/Servises-AsiaApp/M_Education/GetProgramParticipants";
import { SearchKeyModel } from "@/app/Domain/M_Education/Participant";

export const useProgramParticipants = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetProgramParticipants()
    const fetchParticipants = async (searchKey: SearchKeyModel, page: number = 1) => {
        try {
            const response = await Function(searchKey, page);
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data != null) {
                return response.data.data
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Program Participants",
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
    return { fetchParticipants };
};

