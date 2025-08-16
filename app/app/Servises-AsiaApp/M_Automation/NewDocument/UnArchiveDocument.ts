import { AddDocArchiveModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function UnArchiveDocument(docheapId: string, id: number) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/unarchiveDocument`;
//     let method = "Delete";
//     let data = {
//         "docHeapId": docheapId,
//         "archiveId": id,
//     }
//     let response: AxiosResponse<Response<AddDocArchiveModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const UnArchiveDocument = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/unarchiveDocument`;
    let method = "Delete";
    let data = {
        "docHeapId": docheapId,
        "archiveId": id,
    }
        let response: AxiosResponse<Response<AddDocArchiveModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UnArchiveDocument