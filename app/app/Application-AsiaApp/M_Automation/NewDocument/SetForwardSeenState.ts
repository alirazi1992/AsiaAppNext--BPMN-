'use client'
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import SetForwardSeen from "@/app/Servises-AsiaApp/M_Automation/NewDocument/SetForwardSeen";

export const forwardSeen = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = SetForwardSeen()
    const ForwardState = async (docheapId: string, forwardParentId: number) => {
        const response = await Function(docheapId, forwardParentId)
        if (response) {
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.data.status == true && response.data.data == 1) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: 'Set forward seen',
                        text: response.data.status == false ? "ثبت وضعیت مشاهده مدرک به حالت مشاهده شده با مشکل مواجه شد" : response.data.message,
                        icon: response.data.status == true ? "warning" : 'error',
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }
            }
        }
    }
    return { ForwardState };
}