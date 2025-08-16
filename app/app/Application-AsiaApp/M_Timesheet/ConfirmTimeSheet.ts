import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import ConfirmTimeSheet from '@/app/Servises-AsiaApp/M_Timesheet/ConfirmTimesheet'

export const ConfirmTimesheet = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = ConfirmTimeSheet()
    const Confirm = async (masterId: number, state: boolean) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: state ? 'unConfirm timesheet!' : "Confirm Timesheet!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, confirm it!"
        })
        if (result.isConfirmed) {
            const response = await Function(masterId, state);
            if (response) {
                if (response.data.data) {
                    return response.data.data
                } else {
                    const res = Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: state ? 'un Confirm timesheet!' : "Confirm Timesheet!",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                    return res
                }
            }
        } else {
            const res = 'dissmiss'
            return res
        }
    }
    return { Confirm };
}