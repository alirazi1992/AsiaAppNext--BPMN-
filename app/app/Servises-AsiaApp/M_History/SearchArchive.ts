import { SearchArchiveModel, SearchArchiveModels } from "@/app/Domain/M_History/Archive";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SearchArchive = async (page: number = 1, items: SearchArchiveModel) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/SearchHArchives`;
//     let method: string = 'post';
//     let data = {
//         "pageNo": page,
//         "pageCount": 10,
//         "asiaCode": items.SearchArchive.AsiaCode,
//         "regNo": items.SearchArchive.RegNo,
//         "docNo": items.SearchArchive.DocNo,
//         "sender": items.SearchArchive.sender,
//         "subject": items.SearchArchive.subject,
//         "receiver": items.SearchArchive.receiver,
//         "comment": items.SearchArchive.comment,
//         "vesselName": items.SearchArchive.vesselName,
//         "archiveCategoryId": items.SearchArchive.archiveCategoryId,
//         "archiveStartDate": items.SearchArchive.archiveStartDate,
//         "archiveEndDate": items.SearchArchive.archiveEndDate
//     }
//     let response: AxiosResponse<Response<SearchArchiveModels>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SearchArchive

const SearchArchive = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (page: number = 1, items: SearchArchiveModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/SearchHArchives`;
        let method: string = 'post';
        let data = {
            "pageNo": page,
            "pageCount": 10,
            "asiaCode": items.SearchArchive.AsiaCode,
            "regNo": items.SearchArchive.RegNo,
            "docNo": items.SearchArchive.DocNo,
            "sender": items.SearchArchive.sender,
            "subject": items.SearchArchive.subject,
            "receiver": items.SearchArchive.receiver,
            "comment": items.SearchArchive.comment,
            "vesselName": items.SearchArchive.vesselName,
            "archiveCategoryId": items.SearchArchive.archiveCategoryId,
            "archiveStartDate": items.SearchArchive.archiveStartDate,
            "archiveEndDate": items.SearchArchive.archiveEndDate
        }
        let response: AxiosResponse<Response<SearchArchiveModels>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SearchArchive