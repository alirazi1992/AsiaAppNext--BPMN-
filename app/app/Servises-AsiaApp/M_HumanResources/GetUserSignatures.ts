import { GetUserSignaturesResulltModel } from "@/app/Domain/M_HumanRecourse/UserProfile";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function GetUserSignatures(userId: string) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserSignatures?userId=${userId}`;
//     let method: string = 'get';
//     let data = {};
//     let response: AxiosResponse<Response<GetUserSignaturesResulltModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetUserSignatures = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (userId: string) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserSignatures?userId=${userId}`;
        let method: string = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetUserSignaturesResulltModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetUserSignatures