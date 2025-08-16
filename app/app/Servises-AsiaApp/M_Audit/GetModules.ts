import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { GetModulesModel } from "@/app/Domain/M_Audit/logTable";

// const GetModules = async () => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetModules`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<GetModulesModel[]> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetModules;

const GetModules = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetModules`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<GetModulesModel[]> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetModules