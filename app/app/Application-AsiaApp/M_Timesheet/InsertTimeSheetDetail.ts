import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
// import { DetailsModel } from "@/app/Domain/M_Timesheet/model";
import AddTimeSheetDetail from "@/app/Servises-AsiaApp/M_Timesheet/AddTimesheetDetails";

export const InsertingTimeSheetDetails = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = AddTimeSheetDetail()
    const InsertTimeSheetDetail = async (items: any, masterId: number) => {
        const result = await Swal.fire({
            background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
            color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
            allowOutsideClick: false,
            title: "Add Timesheet detail!",
            text: "Are you sure?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add it!"
        })
        if (result.isConfirmed) {
            const response = await Function(items, masterId);
            if (response) {
                if (response.data.data) {
                    return response.data.data
                } else {
                    Swal.fire({
                        background: !themeMode || themeMode?.stateMode == true ? "#22303c" : "#eee3d7",
                        color: !themeMode || themeMode?.stateMode == true ? "white" : "#463b2f",
                        allowOutsideClick: false,
                        title: "Add Timesheet detail!",
                        text: response.data.message,
                        icon: response.data.status ? "warning" : "error",
                        confirmButtonColor: "#22c55e",
                        confirmButtonText: "Ok!"
                    })
                }
            }
        } else {
            const res = 'dissmiss'
            return res
        }
    }
    return { InsertTimeSheetDetail };
}