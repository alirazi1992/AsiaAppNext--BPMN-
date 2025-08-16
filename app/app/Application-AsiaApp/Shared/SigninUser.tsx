import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import Login from "@/app/Servises-AsiaApp/Shared/Loging";
import { LoginData } from "@/app/Domain/shared";

export const useSignin = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = Login();
    const LoginUser = async (dataItem: LoginData) => {
        try {
            const response = await Function(dataItem);
            if (response.status == 401) {
                return response.data.message
            } else {
                if ( response.data.data.activeRole !== null && response.data.status == true) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Sign in",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }
            }
        } catch (error: unknown) {
            const res = 'error';
            return res
        }
    }
    return { LoginUser };
};