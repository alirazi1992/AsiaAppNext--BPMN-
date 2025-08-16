
import { GetUserTimesheetDetails, TimesheetDetailsModel } from "@/app/Domain/M_Timesheet/model";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const GetTimesheetDetail = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (userId: string, dateItem: any) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/GetTimesheetDetails`;
        let method: string = 'post';
        let data = {
            "userId": userId,
            "month": dateItem.month,
            "year": dateItem.year
        }
        let response: AxiosResponse<Response<GetUserTimesheetDetails>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetTimesheetDetail;