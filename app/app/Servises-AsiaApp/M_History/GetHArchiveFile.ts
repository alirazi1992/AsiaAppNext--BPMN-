import { GetHArchiveFileModel } from "@/app/Domain/M_History/Archive";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetHArchiveFile = async (id: number) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/GetHArchiveFile?id=${id}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetHArchiveFileModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetHArchiveFile;

const GetHArchiveFile = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/GetHArchiveFile?id=${id}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetHArchiveFileModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetHArchiveFile
