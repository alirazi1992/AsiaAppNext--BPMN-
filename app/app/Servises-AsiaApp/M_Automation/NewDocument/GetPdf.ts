import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetPdf = async (docheapId: string, templateId: number, docTypeId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getpdf`;
//     let method = 'post';
//     let data = {
//         "docHeapId": docheapId,
//         "docLayoutId": templateId,
//         "docTypeId": docTypeId
//     }
//     let response: AxiosResponse<Response<string>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetPdf

const GetPdf = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, templateId: number, docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getpdf`;
        let method = 'post';
        let data = {
            "docHeapId": docheapId,
            "docLayoutId": templateId,
            "docTypeId": docTypeId
        }
        let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetPdf