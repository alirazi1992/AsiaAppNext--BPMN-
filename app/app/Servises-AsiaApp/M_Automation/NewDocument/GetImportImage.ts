import { DownloadAttachment } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetImportImage = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getimportimage?docHeapId=${docheapId}`;
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Response<DownloadAttachment>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetImportImage

const GetImportImage = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getimportimage?docHeapId=${docheapId}`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<DownloadAttachment>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetImportImage