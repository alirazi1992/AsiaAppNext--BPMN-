import { GetParaphsListModel } from "@/app/Domain/M_Automation/NewDocument/Paraph";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetParaphslist = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getparaphslist?docHeapId=${docheapId}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetParaphsListModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetParaphslist

const GetParaphslist = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getparaphslist?docHeapId=${docheapId}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetParaphsListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetParaphslist