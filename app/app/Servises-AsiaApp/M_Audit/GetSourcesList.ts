import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { GetSourceListModel } from "@/app/Domain/M_Audit/logTable";

// const GetSourceList = async (id: number) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetSourcesList?moduleId=${id}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetSourceListModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetSourceList;

const GetSourceList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetSourcesList?moduleId=${id}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetSourceListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetSourceList