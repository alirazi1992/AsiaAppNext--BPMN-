import { GetCourseCategoriesModel } from "@/app/Domain/M_Education/Categories";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetCourseCategories = async (searchKey: string = '', page: number = 1) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetCourseCategories`;
//     let method: string = 'post';
//     let data = {
//         "pageCount": 10,
//         "pageNo": page,
//         "searchKey": searchKey
//     }
//     let response: AxiosResponse<Response<GetCourseCategoriesModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetCourseCategories

const GetCourseCategories = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (searchKey: string = '', page: number = 1) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetCourseCategories`;
        let method: string = 'post';
        let data = {
            "pageCount": 10,
            "pageNo": page,
            "searchKey": searchKey
        }
        let response: AxiosResponse<Response<GetCourseCategoriesModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetCourseCategories