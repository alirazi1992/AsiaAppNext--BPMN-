
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const AddTimeSheet = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (userId: string, dateItem: any) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Timesheet/Manage/AddTimesheet`;
        let method: string = 'put';
        let data = {
            "userId": userId,
            "month": dateItem.month,
            "year": dateItem.year
        };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddTimeSheet

