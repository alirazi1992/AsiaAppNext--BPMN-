import { UploadFilesModel, UploadListofAttachmentsModel } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SaveMainImage = async (file: UploadFilesModel, docheapId: string, docTypeId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savemainimage`;
//     let method = "put";
//     let data = {
//         file: file.file,
//         desc: file.desc,
//         title: file.title,
//         type: file.type,
//         docHeapId: docheapId,
//         docTypeId: docTypeId
//     };
//     let response: AxiosResponse<Response<UploadListofAttachmentsModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SaveMainImage

const SaveMainImage = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (file: UploadFilesModel, docheapId: string, docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savemainimage`;
        let method = "put";
        let data = {
            file: file.file,
            desc: file.desc,
            title: file.title,
            type: file.type,
            docHeapId: docheapId,
            docTypeId: docTypeId
        };
        let response: AxiosResponse<Response<UploadListofAttachmentsModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SaveMainImage