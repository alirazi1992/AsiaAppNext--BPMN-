
// import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { GetActorsModel } from "@/app/Domain/M_Audit/logTable";

// const GetActors = async () => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetActors`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<GetActorsModel[]> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetActors;

const GetActors = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Audit/report/GetActors`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<GetActorsModel[]> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetActors