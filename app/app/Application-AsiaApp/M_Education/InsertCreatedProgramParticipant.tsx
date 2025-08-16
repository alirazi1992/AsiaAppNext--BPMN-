import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import AddProgramParticipant from "@/app/Servises-AsiaApp/M_Education/AddProgramParticipant";
import { ParticipantModel } from "@/app/Domain/M_Education/Participant";


export const InsertingProgramParticipant = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AddProgramParticipant()
    const AddParticipant = async (dataItems: ParticipantModel[]) => {
        const response = await Function(dataItems);
        if (response) {
            if (response.status == 401) {
                return response.data.message
            }else{
            if ( response.data.data !== null && response.data.status == true) {
                return response.data.data
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Add Program Participant",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        }
    }
    return { AddParticipant };
}