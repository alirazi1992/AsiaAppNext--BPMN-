import { UploadFilesModel, UploadListofAttachmentsModel } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const UploadListofAttachments = async (docheapId: string, docTypeId: string, UploadFiles: UploadFilesModel[]) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/UploadListOfAttachment`;
//     let method = "put";
//     let data = {
//         "docHeapId": docheapId,
//         "docTypeId": docTypeId,
//         "files": UploadFiles
//     }
//     let response: AxiosResponse<Response<UploadListofAttachmentsModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default UploadListofAttachments

const UploadListofAttachments = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, docTypeId: string, UploadFiles: UploadFilesModel[]) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/UploadListOfAttachment`;
        let method = "put";
        let data = {
            "docHeapId": docheapId,
            "docTypeId": docTypeId,
            "files": UploadFiles
        }
        let response: AxiosResponse<Response<UploadListofAttachmentsModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UploadListofAttachments