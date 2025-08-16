


import { GetDraftsModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetDrafts = async () => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdrafts`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetDraftsModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetDrafts

const GetDrafts = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdrafts`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetDraftsModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetDrafts
