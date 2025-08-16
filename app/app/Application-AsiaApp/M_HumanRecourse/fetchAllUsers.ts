import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetUsers from "@/app/Servises-AsiaApp/M_HumanResources/GetUsers";
import { GetAcsUsersModel } from "@/app/Domain/M_Education/Participant";


export const useAcsUsers = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetUsers()
    const fetchUsers = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return response.data.message
            }else{
            if ( response.data.data != null) {
                return response.data.data.map((item: GetAcsUsersModel) => {
                    return {
                        value: item.id,
                        label: item.faName,
                        faName: item.faName,
                        name: item.name,
                        id: item.id
                    }
                })
            } else {
                Swal.fire({
                    background: !themeMode ||themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode ||themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Users",
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
    return { fetchUsers };
};

