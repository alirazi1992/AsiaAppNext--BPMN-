import { GetDocumentDataModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetDocumentData = async (docheapId: string, docTypeId: string) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdocumentdata?docheapId=${docheapId}&docTypeId=${docTypeId}`;
//     let method: string = 'post';
//     let data = {}
//     let response: AxiosResponse<Response<GetDocumentDataModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetDocumentData

const GetDocumentData = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, docTypeId: string) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdocumentdata?docheapId=${docheapId}&docTypeId=${docTypeId}`;
        let method: string = 'post';
        let data = {}
        let response: AxiosResponse<Response<GetDocumentDataModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetDocumentData