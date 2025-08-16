import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

const SetForwardSeen = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (docheapId: string, forwardParentId: number | null) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/setforwardseen`;
        let method = "Patch";
        let data = { "targetId": forwardParentId, "docHeapId": docheapId };
        let response: AxiosResponse<Response<number>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SetForwardSeen