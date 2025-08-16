import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import IssueCertificate from "@/app/Servises-AsiaApp/M_Education/IssueEducationProgramCertificate";

export const IssueProgramCertificarte = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = IssueCertificate()
    const IssueParticipant = async (id: number) => {
        const response = await Function(id);
        if (response) {
            if (response.status == 401) {
                return response.data.message
            }else{
            if (response.data.data != 0 && response.data.status == true) {
                return response.data.data
            } else {
                Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Issue Education Program Certificate?",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
            }}
        }
    }
    return { IssueParticipant };
}