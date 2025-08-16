'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetActors from "@/app/Servises-AsiaApp/M_Audit/GetActors";
import { GetActorsModel } from "@/app/Domain/M_Audit/logTable";

export const useAuditActors = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetActors();
    const fetchActors = async () => {
        try {
            const response = await Function();
            if (response.status == 401) {
                return 'UnAuthorized'
            } else {
                if ( response.data.length >= 0) {
                    return [{
                        title: 'همه',
                        actorId: 0,
                        level: 0,
                        label: 'همه',
                        value: 0
                    }, ...response.data.map((item: GetActorsModel) => {
                        return {
                            title: item.title,
                            actorId: item.actorId,
                            level: item.level,
                            label: item.title,
                            value: item.actorId
                        }
                    })]
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get Actors",
                        icon: response.status ? "warning" : "error",
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
    return { fetchActors };
};