import { UploadFilesModel, UploadListofAttachmentsModel } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const UploadAttachment = async (docheapId: string, docTypeId: string, UploadFile: UploadFilesModel) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/uploadattachment`;
//     let method = "put";
//     let data = {
//         "file": UploadFile.file,
//         "type": UploadFile.type,
//         "title": UploadFile.title,
//         "desc": UploadFile.desc,
//         "docHeapId": docheapId,
//         "docTypeId": docTypeId
//     }
//     let response: AxiosResponse<Response<UploadListofAttachmentsModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default UploadAttachment


const UploadAttachment = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, docTypeId: string, UploadFile: UploadFilesModel) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/uploadattachment`;
        let method = "put";
        let data = {
            "file": UploadFile.file,
            "type": UploadFile.type,
            "title": UploadFile.title,
            "desc": UploadFile.desc,
            "docHeapId": docheapId,
            "docTypeId": docTypeId
        }
        let response: AxiosResponse<Response<UploadListofAttachmentsModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UploadAttachment