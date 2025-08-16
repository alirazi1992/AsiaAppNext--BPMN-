
import { GetBranchListModel } from "@/app/Application-AsiaApp/Utils/shared";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const GetOrganizationBranchesList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/identity/manage/GetOrganizationBranchesList?parentId=1`;
        let method: string = 'get';
        let data = {};
        let response: AxiosResponse<Response<GetBranchListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetOrganizationBranchesList

