

import { GetFieldRepositoryModel } from "@/app/Domain/M_Automation/NewDocument/DocumentInformation";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetFieldRepository = async (fieldId: number) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?fieldId=${fieldId}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetFieldRepositoryModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetFieldRepository

const GetFieldRepository = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (fieldId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?fieldId=${fieldId}`;
    let method: string = 'get';
    let data = {}
    let response: AxiosResponse<Response<GetFieldRepositoryModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetFieldRepository