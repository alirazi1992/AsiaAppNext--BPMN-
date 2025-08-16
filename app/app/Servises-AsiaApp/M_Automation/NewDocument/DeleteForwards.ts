import { RemoveForwardsResultModel } from "@/app/Domain/M_Automation/NewDocument/Forwards";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function RemoveForwards(id: number) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/deleteforward?forwardSrcId=${id}`;
//     let method: string = 'delete';
//     let data = {};
//     let response: AxiosResponse<Response<RemoveForwardsResultModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
const RemoveForwards = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/deleteforward?forwardSrcId=${id}`;
        let method: string = 'delete';
        let data = {};
        let response: AxiosResponse<Response<RemoveForwardsResultModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default RemoveForwards