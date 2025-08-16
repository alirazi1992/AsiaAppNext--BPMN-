import { GetReceiversModel } from "@/app/Domain/M_Automation/NewDocument/Receivers";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const filterReceiversName = async (searchKey: string, fieldId: number) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?searchKey=${searchKey}&fieldId=${fieldId}`;
//     let method = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetReceiversModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
//     return response;
// }
// export default filterReceiversName

const FilterReceiversName = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (searchKey: string, fieldId: number) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Automation/General/getfieldrepository?searchKey=${searchKey}&fieldId=${fieldId}`;
        let method = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetReceiversModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default FilterReceiversName