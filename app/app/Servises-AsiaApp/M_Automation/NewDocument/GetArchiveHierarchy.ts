import { GetArchiveHierarchyModel } from "@/app/Domain/M_Automation/NewDocument/toolbars";
import { Res } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetArchiveHierarchy = async (docheapId: string) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getarchivehierarchy?docHeapId=${docheapId}`;
//     let method = "get";
//     let data = {};
//     let response: AxiosResponse<Res<GetArchiveHierarchyModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetArchiveHierarchy

const GetArchiveHierarchy = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getarchivehierarchy?docHeapId=${docheapId}`;
        let method = "get";
        let data = {};
        let response: AxiosResponse<Res<GetArchiveHierarchyModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetArchiveHierarchy
