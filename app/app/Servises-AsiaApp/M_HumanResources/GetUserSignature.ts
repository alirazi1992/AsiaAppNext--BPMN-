import { GetUserSignatureResultModel } from "@/app/Domain/M_HumanRecourse/UserProfile";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function GetUserSignature(id: number) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserSignature?Id=${id}`;
//     let method: string = 'get';
//     let data = {};
//     let response: AxiosResponse<Response<GetUserSignatureResultModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetUserSignature = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/GetUserSignature?Id=${id}`;
        let method: string = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetUserSignatureResultModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetUserSignature