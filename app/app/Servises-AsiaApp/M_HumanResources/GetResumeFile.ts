import { GetResumeFileModel } from "@/app/Domain/M_HumanRecourse/ManageResume";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function GetResumeFile(id: number) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetResumeFile?resumeId=${id}`;
//     let method = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetResumeFileModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetResumeFile = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetResumeFile?resumeId=${id}`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetResumeFileModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetResumeFile