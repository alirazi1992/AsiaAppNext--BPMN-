import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetTimesheetReportByBranch from "@/app/Servises-AsiaApp/M_Timesheet/GetTimesheetReportByBranch";

export const useTimesheetbyBranch = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetTimesheetReportByBranch();
    const fetchBranchTimesheet = async (dateItems: any) => {
        try {
            const response = await Function(dateItems);
            if (response.status == 401) {
                return response.data.message
            } else {
                if (response.data.status == true && response.data.data !== null) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Get timesheet report by branch!",
                        text: response.data.message,
                        icon: "error",
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
    return { fetchBranchTimesheet };
};