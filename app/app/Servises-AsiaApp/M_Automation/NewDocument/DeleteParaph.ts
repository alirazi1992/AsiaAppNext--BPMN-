
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function RemoveParaph(docheapId: string, id: number) {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removeparaph?docHeapId=${docheapId}&ParaphId=${id}`;
//     let method: string = 'delete';
//     let data = {};
//     let response: AxiosResponse<Response<number>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const RemoveParaph = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, id: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/removeparaph?docHeapId=${docheapId}&ParaphId=${id}`;
        let method: string = 'delete';
        let data = {};
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default RemoveParaph