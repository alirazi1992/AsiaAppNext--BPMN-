import { GetAttachmentPdfModel } from "@/app/Domain/M_Automation/NewDocument/Forwards";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const DownLoadAttachmentPdf = async (attchmentId: number) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${attchmentId}&attachmentType=2`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetAttachmentPdfModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default DownLoadAttachmentPdf


const DownLoadAttachmentPdf = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (attchmentId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/downloadattachment?id=${attchmentId}&attachmentType=2`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetAttachmentPdfModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default DownLoadAttachmentPdf