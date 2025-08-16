import type { GetPersonnelWorkPermitsInitial } from "@/app/Domain/M_Automation/formManagement";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function GetPersonnelWorkPermitsInitial(id:number) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/GetPersonnelWorkPermitsInitial?docTypeId=${id}`;
//     let method = 'get';
//     let data = {};
//     let response: AxiosResponse<Response<GetPersonnelWorkPermitsInitial>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetPersonnelWorkPermitsInitial = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id:number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/GetPersonnelWorkPermitsInitial?docTypeId=${id}`;
    let method = 'get';
    let data = {};
        let response: AxiosResponse<Response<GetPersonnelWorkPermitsInitial>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetPersonnelWorkPermitsInitial