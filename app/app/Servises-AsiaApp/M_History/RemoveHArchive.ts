
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function RemoveHArchive(id: number) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/DeleteHArchiveDoc?id=${id}`;
//     let method: string = 'delete';
//     let data = {};
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }


const RemoveHArchive = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/DeleteHArchiveDoc?id=${id}`;
    let method: string = 'delete';
    let data = {};
    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default RemoveHArchive