import { GetAcsUsersModel } from "@/app/Domain/M_Education/Participant";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const GetUsers = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUsers`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetAcsUsersModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetUsers