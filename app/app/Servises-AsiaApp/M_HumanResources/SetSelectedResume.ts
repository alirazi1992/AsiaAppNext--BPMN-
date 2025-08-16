
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export async function SetSelectedResume(item: any) {
//     const url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/SetSelectedResume`;
//     let method = 'put';
//     let data = {
//         "id": item.id,
//         "isSelected": !item.isSelected
//     }
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const SetSelectedResume = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (item: any) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/SetSelectedResume`;
        let method = 'put';
        let data = {
            "id": item.id,
            "isSelected": !item.isSelected
        }
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default SetSelectedResume