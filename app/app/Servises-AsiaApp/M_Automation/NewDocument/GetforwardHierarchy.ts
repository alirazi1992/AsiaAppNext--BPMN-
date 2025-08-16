import { GetForwardHierarchyModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetForwardHierarchy = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardhierarchy?docHeapId=${docheapId}`;
//         let method = "get";
//         let data = {};
//     let response: AxiosResponse<Response<GetForwardHierarchyModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetForwardHierarchy

const GetForwardHierarchy = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getforwardhierarchy?docHeapId=${docheapId}`;
        let method = "get";
        let data = {};
    let response: AxiosResponse<Response<GetForwardHierarchyModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetForwardHierarchy