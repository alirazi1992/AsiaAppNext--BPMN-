import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function RevokeDoc(docTypeId: string, docheapId: string, description: string) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/revokedocument`;
//     let method = "delete";
//     let data = {
//         "DocTypeId": docTypeId, "DocHeapId": docheapId, "RevokedDesc": description
//     };
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }


const RevokeDoc = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docTypeId: string, docheapId: string, description: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/revokedocument`;
    let method = "delete";
    let data = {
        "DocTypeId": docTypeId, "DocHeapId": docheapId, "RevokedDesc": description
    };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default RevokeDoc