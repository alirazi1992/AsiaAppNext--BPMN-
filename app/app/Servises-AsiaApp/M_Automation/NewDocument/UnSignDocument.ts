import { UnSignDocumentModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function UnSignDocument(signatureId: number, docheapId: string, docTypeId: string) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/unsigndocument`;
//     let method: string = 'delete';
//     let data = {
//         "signatureId": signatureId,
//         "docHeapId": docheapId,
//         "docTypeId": docTypeId
//     };
//     let response: AxiosResponse<Response<UnSignDocumentModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const UnSignDocument = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (signatureId: number, docheapId: string, docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/unsigndocument`;
        let method: string = 'delete';
        let data = {
            "signatureId": signatureId,
            "docHeapId": docheapId,
            "docTypeId": docTypeId
        };
        let response: AxiosResponse<Response<UnSignDocumentModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UnSignDocument