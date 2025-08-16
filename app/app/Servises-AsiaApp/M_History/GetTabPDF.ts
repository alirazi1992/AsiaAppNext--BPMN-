
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetTabPdf = async (id: number) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/GetTabPDF?tabId=${id}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<string>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetTabPdf;


const GetTabPdf = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/History/manage/GetTabPDF?tabId=${id}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<string>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetTabPdf
