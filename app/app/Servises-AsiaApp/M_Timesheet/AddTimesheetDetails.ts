import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const AddTimeSheetDetail = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (items: any, masterId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/AddTimesheetDetails`;
        let method: string = 'patch';
        let data = {
            "items": items.map((item: any) => {
                return {
                    timeSpendBoundryItemId: item.boundryItemId,
                    time: item.time,
                    timeSpendDate: item.spendTimeDate
                }
            }),
            "timesheetMasterId": masterId
        }
        const response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddTimeSheetDetail