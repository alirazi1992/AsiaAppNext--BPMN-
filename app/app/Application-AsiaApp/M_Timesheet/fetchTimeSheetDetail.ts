import Swal from "sweetalert2";
import themeStore from '@/app/zustandData/theme.zustand';
import useStore from "@/app/hooks/useStore";
import GetTimesheetDetail from "@/app/Servises-AsiaApp/M_Timesheet/GetTimesheetDetails";

export const useDetails = () => {
    const themeMode = useStore(themeStore, (state) => state)
    const { Function } = GetTimesheetDetail();
    const fetchTimeSheetDetails = async (userId: string, dateItem: any) => {
        try {
            const response = await Function(userId, dateItem);
            if (response.status == 401) {
                return response.data.message
            } else {
                return response.data.data
            }
        } catch (error) {
            const res = 'dissmiss'
            return res

        }
    }
    return { fetchTimeSheetDetails };
};