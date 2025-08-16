
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const ConfirmTimeSheet = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (masterId: number, boolean: boolean) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/ConfirmTimesheet?timesheetMasterId=${masterId}`;
        let method: string = 'patch';
        let data = {};
        let response: AxiosResponse<Response<any>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default ConfirmTimeSheet

