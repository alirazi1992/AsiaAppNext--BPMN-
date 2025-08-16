import { AddRelationResultModel } from "@/app/Domain/M_Automation/NewDocument/Keywords";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function AddRelation(docheapId: string, relatedDocHeapId: number, relationTypeId: number, isNext: boolean) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addrelation`;
//     let method: string = 'put'
//     let data = {
//         "documentId": docheapId,
//         "relatedDocHeapId": relatedDocHeapId,
//         "relationTypeId": relationTypeId,
//         "isNextRelation": isNext
//     };
//     let response: AxiosResponse<Response<AddRelationResultModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
const AddRelation = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, relatedDocHeapId: number, relationTypeId: number, isNext: boolean) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addrelation`;
        let method: string = 'put'
        let data = {
            "documentId": docheapId,
            "relatedDocHeapId": relatedDocHeapId,
            "relationTypeId": relationTypeId,
            "isNextRelation": isNext
        };
        let response: AxiosResponse<Response<AddRelationResultModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddRelation