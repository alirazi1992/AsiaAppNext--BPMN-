import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { GetActionsModel } from "@/app/Domain/M_Audit/logTable";

// const GetActionList = async (id: number) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetActionsList?sourceCodeId=${id}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetActionsModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetActionList;

const GetActionList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetActionsList?sourceCodeId=${id}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetActionsModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetActionList