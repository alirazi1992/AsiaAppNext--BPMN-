import { SearchTabModel, SearchTabModels } from "@/app/Domain/M_History/Tabs";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SearchTabs = async (page: number = 1, items: SearchTabModel) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/SearchTabs`;
//     let method: string = 'post';
//     let data = {
//         "pageNo": page,
//         "pageCount": 10,
//         "customerName": items.customerName,
//         "nationaCode": items.nationaCode,
//         "tabCodeId": items.tabCodeId,
//         "tabStartDate": items.tabStartDate,
//         "tabEndDate": items.tabEndDate
//     }
//     let response: AxiosResponse<Response<SearchTabModels>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SearchTabs


const SearchTabs = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (page: number = 1, items: SearchTabModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/SearchTabs`;
    let method: string = 'post';
    let data = {
        "pageNo": page,
        "pageCount": 10,
        "customerName": items.customerName,
        "nationaCode": items.nationaCode,
        "tabCodeId": items.tabCodeId,
        "tabStartDate": items.tabStartDate,
        "tabEndDate": items.tabEndDate
    }
    let response: AxiosResponse<Response<SearchTabModels>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SearchTabs
