import { SaveKeywordModel } from "@/app/Domain/M_Automation/NewDocument/Keywords";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SaveKeyword = async (keyword: string, docheapId: string, docTypeId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savekeyword`
//     let method = 'put';
//     let data = {
//         "keyword": keyword,
//         "docHeapId": docheapId,
//         "docTypeId": docTypeId
//     }
//     let response: AxiosResponse<Response<SaveKeywordModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SaveKeyword

const SaveKeyword = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (keyword: string, docheapId: string, docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savekeyword`
        let method = 'put';
        let data = {
            "keyword": keyword,
            "docHeapId": docheapId,
            "docTypeId": docTypeId
        }
        let response: AxiosResponse<Response<SaveKeywordModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SaveKeyword