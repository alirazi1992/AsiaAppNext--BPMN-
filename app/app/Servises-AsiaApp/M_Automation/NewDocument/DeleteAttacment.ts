import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function RemoveAttachments(id: number, docheapId: string, docTypeId: string) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removeappendix?docHeapId=${docheapId}&id=${id}&docTypeId=${docTypeId}`;
//     let method = "delete";
//     let data = {};
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const RemoveAttachments = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number, docheapId: string, docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removeappendix?docHeapId=${docheapId}&id=${id}&docTypeId=${docTypeId}`;
        let method = "delete";
        let data = {};
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default RemoveAttachments