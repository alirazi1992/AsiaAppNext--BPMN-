import { SignDocumentModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SubmitDocument = async (docheapId: string, submitDate: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/submitdocument`;
//     let method = "post";
//     let data = {
//         "docHeapId": docheapId,
//         "submitDate": submitDate
//     };
//     let response: AxiosResponse<Response<string>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SubmitDocument

const SubmitDocument = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, submitDate: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/submitdocument`;
        let method = "post";
        let data = {
            "docHeapId": docheapId,
            "submitDate": submitDate
        };
        let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SubmitDocument