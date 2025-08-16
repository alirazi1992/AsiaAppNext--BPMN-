
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { GetCategoriesModel } from "@/app/Domain/M_History/Archive";

// const GetCategoriesList = async () => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/Categories`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetCategoriesModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetCategoriesList;

const GetCategoriesList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/archive/Manage/Categories`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetCategoriesModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetCategoriesList