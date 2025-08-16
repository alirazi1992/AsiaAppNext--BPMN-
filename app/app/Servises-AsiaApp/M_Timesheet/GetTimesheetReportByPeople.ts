import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const GetTimesheetReportByPeople = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: any) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/GetTimesheetReportByPeople`;
        let method: string = 'post';
        let data = {
            "startDate": dataItems.startDate,
            "endDate": dataItems.endDate,
            "peopleId": dataItems.peopleId
        }
        let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetTimesheetReportByPeople;