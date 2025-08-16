

import { AuditItemsModel, GetLogsResultModel } from "@/app/Domain/M_Audit/logTable";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function GetLogs(page: number = 1, item: AuditItemsModel) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetLogs`;
//     let method: string = 'post';
//     let data = {
//         "actionId": item.actionId,
//         "startDate": item.startDate,
//         "endDate": item.endDate,
//         "actorId": item.actorId,
//         "searchText": item.searchText,
//         "pageNo": page,
//         "count": 10
//     };
//     let response: AxiosResponse<Response<GetLogsResultModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetLogs = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (page: number = 1, item: AuditItemsModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetLogs`;
        let method: string = 'post';
        let data = {
            "actionId": item.actionId,
            "startDate": item.startDate,
            "endDate": item.endDate,
            "actorId": item.actorId,
            "searchText": item.searchText,
            "pageNo": page,
            "count": 10
        };
        let response: AxiosResponse<Response<GetLogsResultModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetLogs