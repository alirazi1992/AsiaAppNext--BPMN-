
import {  GetUnderneathUserNamesModel } from "@/app/Domain/M_Timesheet/model";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const GetUnderneathUserNames = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/GetUnderneathUserNames`;
        let method: string = 'patch';
        let data = {}
        let response: AxiosResponse<Response<GetUnderneathUserNamesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetUnderneathUserNames