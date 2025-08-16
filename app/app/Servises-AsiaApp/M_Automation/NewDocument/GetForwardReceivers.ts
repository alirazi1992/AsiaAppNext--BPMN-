import { GetForwardRecieversModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetForwardReceivers = async () => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardrecievers`;
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Response<GetForwardRecieversModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetForwardReceivers

const GetForwardReceivers = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardrecievers`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetForwardRecieversModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetForwardReceivers