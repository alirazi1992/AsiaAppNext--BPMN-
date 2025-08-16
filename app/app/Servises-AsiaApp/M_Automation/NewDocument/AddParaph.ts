import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { AddParaphResultModel, ParaphItemModel } from "@/app/Domain/M_Automation/NewDocument/Paraph";

// export async function AddParaph(docheapId: string, dataItem: ParaphItemModel) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addparaph`;
//     let method: string = 'put';
//     let data = {
//         "docHeapId": docheapId,
//         "description": dataItem.paraph
//     };
//     let response: AxiosResponse<Response<AddParaphResultModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
const AddParaph = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, dataItem: ParaphItemModel) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/addparaph`;
        let method: string = 'put';
        let data = {
            "docHeapId": docheapId,
            "description": dataItem.paraph
        };
        let response: AxiosResponse<Response<AddParaphResultModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddParaph