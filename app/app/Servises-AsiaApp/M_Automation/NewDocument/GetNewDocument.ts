import { GetDocumentDataModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetNewDocumentData = async (docTypeId: string, draftId: string, layoutType: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getnewdocument`;
//     let method = "post";
//     let data = {
//         "docTypeId": docTypeId,
//         "draftId": draftId,
//         "layoutType": layoutType
//     }
//     let response: AxiosResponse<Response<GetDocumentDataModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetNewDocumentData

const GetNewDocumentData = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docTypeId: string, draftId: string, layoutType: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getnewdocument`;
    let method = "post";
    let data = {
        "docTypeId": docTypeId,
        "draftId": draftId,
        "layoutType": layoutType
    }
        let response: AxiosResponse<Response<GetDocumentDataModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetNewDocumentData