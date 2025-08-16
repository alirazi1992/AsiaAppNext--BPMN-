


import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function RemoveRelation(id: number, docheapId: string) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removerelation?id=${id}&docHeapId=${docheapId}`;
//     let method: string = 'delete';
//     let data = {};
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
const RemoveRelation = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number, docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removerelation?id=${id}&docHeapId=${docheapId}`;
    let method: string = 'delete';
    let data = {};
    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default RemoveRelation