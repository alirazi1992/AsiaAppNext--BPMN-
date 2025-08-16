import { GetAttachmentsList } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetAttachmentList = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getattachmentslist?docHeapId=${docheapId}`;
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Response<GetAttachmentsList[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetAttachmentList


const GetAttachmentList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getattachmentslist?docHeapId=${docheapId}`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetAttachmentsList[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetAttachmentList