import { UpdateArchiveModel } from "@/app/Domain/M_History/Archive";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const UpdateHArchiveDoc = async (dataItems: UpdateArchiveModel) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/PatchHArchiveDoc`;
//     let method: string = 'patch';
//     let data = {
//         "id": dataItems.UpdateArchive.id,
//         "subject": dataItems.UpdateArchive.subject,
//         "docNo": dataItems.UpdateArchive.DocNo,
//         "sender": dataItems.UpdateArchive.sender,
//         "receiver": dataItems.UpdateArchive.receiver,
//         "vesselNameF": dataItems.UpdateArchive.vesselNameF,
//         "vesselNameE": dataItems.UpdateArchive.vesselNameE,
//         "asiaCode": dataItems.UpdateArchive.AsiaCode,
//         "regNo": dataItems.UpdateArchive.RegNo,
//         "archiveCategoryId": dataItems.UpdateArchive.archiveCategoryId,
//         "comment": dataItems.UpdateArchive.comment
//     }

//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default UpdateHArchiveDoc

const UpdateHArchiveDoc = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: UpdateArchiveModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/PatchHArchiveDoc`;
        let method: string = 'patch';
        let data = {
            "id": dataItems.UpdateArchive.id,
            "subject": dataItems.UpdateArchive.subject,
            "docNo": dataItems.UpdateArchive.DocNo,
            "sender": dataItems.UpdateArchive.sender,
            "receiver": dataItems.UpdateArchive.receiver,
            "vesselNameF": dataItems.UpdateArchive.vesselNameF,
            "vesselNameE": dataItems.UpdateArchive.vesselNameE,
            "asiaCode": dataItems.UpdateArchive.AsiaCode,
            "regNo": dataItems.UpdateArchive.RegNo,
            "archiveCategoryId": dataItems.UpdateArchive.archiveCategoryId,
            "comment": dataItems.UpdateArchive.comment
        }

        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UpdateHArchiveDoc
