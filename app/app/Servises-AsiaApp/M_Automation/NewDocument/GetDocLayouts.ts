import { GetDocLayouts } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetDocLayoutssize = async (docTypeId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdocLayouts?docTypeId=${docTypeId}`;
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Response<GetDocLayouts[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetDocLayoutssize

const GetDocLayoutssize = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docTypeId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getdocLayouts?docTypeId=${docTypeId}`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Response<GetDocLayouts[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetDocLayoutssize
