import { DownloadAttachment } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const DownLoadAttachment = async (id: number) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${id}&attachmentType=3`;
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Response<DownloadAttachment>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default DownLoadAttachment

const DownLoadAttachment = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${id}&attachmentType=3`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<DownloadAttachment>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default DownLoadAttachment