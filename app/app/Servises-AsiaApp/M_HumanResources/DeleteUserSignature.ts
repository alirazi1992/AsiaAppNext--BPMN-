
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function RemoveUserSignature(id: number) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserSignature?Id=${id}`;
//     let method: string = 'delete';
//     let data = {};
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const RemoveUserSignature = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/personnelprofile/manage/DeleteUserSignature?Id=${id}`;
        let method: string = 'delete';
        let data = {};
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default RemoveUserSignature