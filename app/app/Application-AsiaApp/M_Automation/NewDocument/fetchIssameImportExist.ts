
import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetIssameImportExist from "@/app/Servises-AsiaApp/M_Automation/NewDocument/GetIssameImportExists";

export const useExist = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetIssameImportExist()
    const fetchIssameImportExist = async (submitNo: string) => {
        if (submitNo == null || submitNo == ""
        ) {
            const res = Swal.fire({
                background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                allowOutsideClick: false,
                title: "ذخیره مدرک",
                text: "شماره صادره نامه وارده نمیتواند خالی باشد ",
                icon: "warning",
                confirmButtonColor: "#22c55e",
                confirmButtonText: "OK!",
            })
            return res
        } else {
            try {
                const response = await Function(submitNo);
                if (response.status == 401) {
                    return response.data.message
                }else{
                if (response.data.data !== null && response.data.status == true) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get issame import exist",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }}
            } catch (error) {
                const res = 'dissmiss'
                return res
            }
        }
    }
    return { fetchIssameImportExist };
};