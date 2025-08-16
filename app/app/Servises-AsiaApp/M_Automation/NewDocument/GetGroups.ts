import { GetGroupsModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetGroups = async () => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getgroups`;
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Response<GetGroupsModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetGroups

const GetGroups = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getgroups`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetGroupsModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetGroups