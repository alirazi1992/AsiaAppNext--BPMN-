import { GetToolbarResultModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetToolbars = async (docTypeId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctoolbars?docTypeId=${docTypeId}`;
//     let method = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetToolbarResultModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetToolbars


const GetToolbars = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdoctoolbars?docTypeId=${docTypeId}`;
    let method = 'get';
    let data = {}
        let response: AxiosResponse<Response<GetToolbarResultModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetToolbars