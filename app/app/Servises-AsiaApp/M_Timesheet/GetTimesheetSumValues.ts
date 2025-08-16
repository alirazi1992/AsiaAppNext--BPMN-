
import { GetTimeSheetSumValuesModel } from "@/app/Domain/M_Timesheet/model";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const GetTimesheetSumValues = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (masterId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/GetTimesheetSumValues?masterId=${masterId}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetTimeSheetSumValuesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetTimesheetSumValues;