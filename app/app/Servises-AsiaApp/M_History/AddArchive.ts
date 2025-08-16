
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { AddArchiveModel } from "@/app/Domain/M_History/Archive";

// export async function AddHArchiveDoc(dataItems: AddArchiveModel) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/AddHArchiveDoc`;
//     let method: string = 'post';
//     let data = {
//         "subject": dataItems.AddHArchive.subject,
//         "docNo": dataItems.AddHArchive.DocNo,
//         "sender": dataItems.AddHArchive.sender,
//         "receiver": dataItems.AddHArchive.receiver,
//         "vesselNameF": dataItems.AddHArchive.vesselNameF,
//         "vesselNameE": dataItems.AddHArchive.vesselNameE,
//         "asiaCode": dataItems.AddHArchive.AsiaCode,
//         "file": dataItems.AddHArchive.file,
//         "fileName": dataItems.AddHArchive.fileName,
//         "regNo": dataItems.AddHArchive.RegNo,
//         "archiveCategoryId": dataItems.AddHArchive.archiveCategoryId,
//         "comment": dataItems.AddHArchive.comment
//     };
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const AddHArchiveDoc = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: AddArchiveModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/AddHArchiveDoc`;
        let method: string = 'post';
        let data = {
            "subject": dataItems.AddHArchive.subject,
            "docNo": dataItems.AddHArchive.DocNo,
            "sender": dataItems.AddHArchive.sender,
            "receiver": dataItems.AddHArchive.receiver,
            "vesselNameF": dataItems.AddHArchive.vesselNameF,
            "vesselNameE": dataItems.AddHArchive.vesselNameE,
            "asiaCode": dataItems.AddHArchive.AsiaCode,
            "file": dataItems.AddHArchive.file,
            "fileName": dataItems.AddHArchive.fileName,
            "regNo": dataItems.AddHArchive.RegNo,
            "archiveCategoryId": dataItems.AddHArchive.archiveCategoryId,
            "comment": dataItems.AddHArchive.comment
        };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddHArchiveDoc

