import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetVolunteerResumePdf from "@/app/Servises-AsiaApp/M_HumanResources/GetVolunteerResumePdf";

export const usePdf = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetVolunteerResumePdf()
    const fetchVolunteerResumePdf = async (id: number) => {
        try {
            const response = await Function(id);
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.data.status && response.data.data !== null && response.data.data !== '') {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get volunteer resume pdf",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchVolunteerResumePdf };
};