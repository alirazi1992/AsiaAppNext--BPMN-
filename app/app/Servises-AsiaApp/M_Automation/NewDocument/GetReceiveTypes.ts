import { GetRecieveTypesModel } from "@/app/Domain/M_Automation/NewDocument/NewDocument";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetReceiveTypes = async (docTypeId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getreceivetypes?doctypeid=${docTypeId}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetRecieveTypesModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetReceiveTypes

const GetReceiveTypes = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getreceivetypes?doctypeid=${docTypeId}`;
    let method: string = 'get';
    let data = {}
        let response: AxiosResponse<Response<GetRecieveTypesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetReceiveTypes