
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { GetCategoriesListModel } from "@/app/Domain/M_Education/Courses";

// const GetCategoriesList = async () => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetCourseCategoriesList`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetCategoriesListModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetCategoriesList;

const GetCategoriesList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetCourseCategoriesList`;
        let method: string = 'get';
        let data = {}
        let response: AxiosResponse<Response<GetCategoriesListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetCategoriesList
