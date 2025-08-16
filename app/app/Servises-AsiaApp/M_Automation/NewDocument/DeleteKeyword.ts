

import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function DeleteKeyword(id: number, docheapId: string, docTypeId: string) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removekeyword`;
//     let method: string = 'delete';
//     let data = {
//         "id": id,
//         "docHeapId": docheapId,
//         "docTypeId": docTypeId
//     };
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
const DeleteKeyword = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number, docheapId: string, docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removekeyword`;
    let method: string = 'delete';
    let data = {
        "id": id,
        "docHeapId": docheapId,
        "docTypeId": docTypeId
    };
    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default DeleteKeyword