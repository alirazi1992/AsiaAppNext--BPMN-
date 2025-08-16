
import { AxiosResponse } from "axios";
import { Response } from "../../Domain/shared";
import useAxios from "../../hooks/useAxios";

const GetTimesheetMainReportByBranch = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: any) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/GetTimesheetMainReportByBranch`;
        let method: string = 'post';
        let data = {
            "startDate": dataItems.startDate,
            "endDate": dataItems.endDate,
            "branchId": dataItems.branchId
        }
        let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetTimesheetMainReportByBranch;