
import { GetTimesheetBoundriesModel } from "@/app/Domain/M_Timesheet/model";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const GetTimesheetBoundries = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/GetTimesheetBoundries`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetTimesheetBoundriesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetTimesheetBoundries