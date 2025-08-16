
import { GetRelatedDocsListModel } from "@/app/Domain/M_Automation/NewDocument/Keywords";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetRelatedDocslist = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getRelatedDocslist?docHeapId=${docheapId}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetRelatedDocsListModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetRelatedDocslist

const GetRelatedDocslist = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getRelatedDocslist?docHeapId=${docheapId}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetRelatedDocsListModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetRelatedDocslist