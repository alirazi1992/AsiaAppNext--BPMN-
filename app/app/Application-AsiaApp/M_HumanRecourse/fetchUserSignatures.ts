import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetUserSignatures from "@/app/Servises-AsiaApp/M_HumanResources/GetUserSignatures";

export const useSignatures = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetUserSignatures()
    const fetchUserSignatures = async (userId: string) => {
        try {
            const response = await Function(userId);
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.data.status&& response.data.data !== null) {
                    return response.data.data;
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Ger User Signatures!",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return []
                }
            }
        } catch (error) {
            const res = 'dissmiss'
            return res
        }
    }
    return { fetchUserSignatures };
};
