import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetTimesheetBoundries from "@/app/Servises-AsiaApp/M_Timesheet/GetTimesheetBoundries";

export const useList = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetTimesheetBoundries();
    const fetchTimeSheetBoundries = async () => {
        try {
            const response = await Function();
            if (response.status && Array.isArray(response.data.data) && response.data.data.length > 0) {
                return response.data.data;
            } else {
                const res = Swal.fire({
                    background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                    color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                    allowOutsideClick: false,
                    title: "Get Timesheet Boundries!",
                    text: response.data.message,
                    icon: response.data.status ? "warning" : "error",
                    confirmButtonColor: "#22c55e",
                    confirmButtonText: "Ok!"
                })
                return res
            }
        } catch (error) {
            const res = 'dissmiss'
            return res

        }
    }
    return { fetchTimeSheetBoundries };
};