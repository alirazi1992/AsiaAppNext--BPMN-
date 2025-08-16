import { GetDocTypeModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetDocType = async (docheapId: string | null, docTypeId: string) => {
//     let url: string
//     docheapId !== null ? url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctype?docHeapId=${docheapId}`
//         : url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctypebytypeid?typeId=${docTypeId}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetDocTypeModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetDocType

const GetDocType = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string | null, docTypeId: string) => {
        let url: string
        docheapId !== null ? url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctype?docHeapId=${docheapId}`
            : url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctypebytypeid?typeId=${docTypeId}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetDocTypeModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetDocType