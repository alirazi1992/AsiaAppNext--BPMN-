import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const SaveDraft = async (fieldId: string, name: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savedraft`;
//     let method = "put";
//     let data = {
//         "fileId": fieldId,
//         "title": name,
//         "saveDate": new Date().toDateString(),
//         "editState": true
//     };
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default SaveDraft

const SaveDraft = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (fieldId: string, name: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/savedraft`;
        let method = "put";
        let data = {
            "fileId": fieldId,
            "title": name,
            "saveDate": new Date().toDateString(),
            "editState": true
        };
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SaveDraft