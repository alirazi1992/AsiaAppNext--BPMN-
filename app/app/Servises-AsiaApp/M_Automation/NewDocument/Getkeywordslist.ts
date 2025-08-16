import { KeywordModel } from "@/app/Domain/M_Automation/NewDocument/Keywords";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetKeywordsList = async (searchKey: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getKeywordslist?searchKey=${searchKey}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<KeywordModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetKeywordsList

const GetKeywordsList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (searchKey: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getKeywordslist?searchKey=${searchKey}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<KeywordModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetKeywordsList