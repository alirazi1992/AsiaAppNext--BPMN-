import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SetDocumentState = async (forwardParentId: number, stateId: number, docheapId: string, description: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/setdocumentstate`;
//     let method = "patch";
//     let data = {
//         "forwardTargetId": forwardParentId,
//         "stateId": stateId,
//         "desc": description,
//         "docheapId": docheapId
//     };
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SetDocumentState

const SetDocumentState = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (forwardParentId: number, stateId: number, docheapId: string, description: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/setdocumentstate`;
    let method = "patch";
    let data = {
        "forwardTargetId": forwardParentId,
        "stateId": stateId,
        "desc": description,
        "docheapId": docheapId
    };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SetDocumentState