import { DownloadAttachment } from "@/app/Domain/M_Automation/NewDocument/Attachments";
import { GetIssameImportExistModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export const GetIssameImportExist = async (submitNo: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getissameimportExists?indicatorNumber=${submitNo}`
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Response<GetIssameImportExistModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetIssameImportExist = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (submitNo: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getissameimportExists?indicatorNumber=${submitNo}`
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetIssameImportExistModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetIssameImportExist