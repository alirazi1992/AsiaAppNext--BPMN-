import { SignDocumentModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SignDocument = async (docheapId: string, docTypeId: string, forwardParentId: number | null) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/signdocument`;
//     let method: string = 'put';
//     let data = {
//         "docHeapId": docheapId,
//         "docTypeId": docTypeId,
//         "forwardSourceId": forwardParentId
//     }
//     let response: AxiosResponse<Response<SignDocumentModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SignDocument


const SignDocument = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, docTypeId: string, forwardParentId: number | null) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/signdocument`;
        let method: string = 'put';
        let data = {
            "docHeapId": docheapId,
            "docTypeId": docTypeId,
            "forwardSourceId": forwardParentId
        }
        let response: AxiosResponse<Response<SignDocumentModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SignDocument