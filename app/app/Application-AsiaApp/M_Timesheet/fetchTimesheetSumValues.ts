import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetUnderneathUserNames from "@/app/Servises-AsiaApp/M_Timesheet/GetUnderneathUserNames";
import GetTimesheetSumValues from "@/app/Servises-AsiaApp/M_Timesheet/GetTimesheetSumValues";

export const Timesheetsumvalues = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetTimesheetSumValues();
    const fetchTimesheetsumvalues = async (masterId: number) => {
        try {
            const response = await Function(masterId);
            if (response.status == 401) { return response.data.message } else {
                if (response.data.status) {
                    return response.data.data;
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get timesheet sum values!",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }
            }
        } catch (error) {
            const res = 'dissmiss'
            return res

        }
    }
    return { fetchTimesheetsumvalues };
};