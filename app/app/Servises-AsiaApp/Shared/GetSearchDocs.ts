import { GetSerachDocsModel } from "@/app/Domain/searchDocs";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetSearchDocs = async (searchKey: string = '', page: number = 1) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/SearchDocs?searchKey=${searchKey}&pageNo=${page}&count=10`;
//     let method: string = 'get';
//     let data = {};
//     let response: AxiosResponse<Response<GetSerachDocsModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetSearchDocs

const GetSearchDocs =  () => {
    const { AxiosRequest } = useAxios();
    const Function = async (searchKey: string = '', page: number = 1) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/SearchDocs?searchKey=${searchKey}&pageNo=${page}&count=10`;
        let method: string = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetSerachDocsModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return {Function}
}
export default GetSearchDocs