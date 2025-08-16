import { GetForwardsListModel } from "@/app/Domain/M_Automation/NewDocument/Forwards";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetForwardsList = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardslist?docHeapId=${docheapId}`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetForwardsListModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetForwardsList

const GetForwardsList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardslist?docHeapId=${docheapId}`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetForwardsListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetForwardsList