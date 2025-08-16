import { KeywordModel } from "@/app/Domain/M_Automation/NewDocument/Keywords";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetDocKeywordsList = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getDocKeywordslist?docHeapId=${docheapId}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<KeywordModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetDocKeywordsList

const GetDocKeywordsList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getDocKeywordslist?docHeapId=${docheapId}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<KeywordModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetDocKeywordsList