import { CourseCategoriesModels } from "@/app/Domain/M_Education/Categories";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { CategoryItemsModel } from "@/app/Domain/M_Education/Categories";
import { AxiosResponse } from "axios";

// export async function AddCourseCategory(dataItems: CategoryItemsModel) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddCourseCategory`;
//     let method: string = 'put';
//     let data = {
//         "name": dataItems.name,
//         "faName": dataItems.faName
//     };
//     let response: AxiosResponse<Response<CourseCategoriesModels>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const AddCourseCategory = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: CategoryItemsModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddCourseCategory`;
        let method: string = 'put';
        let data = {
            "name": dataItems.name,
            "faName": dataItems.faName
        };
        let response: AxiosResponse<Response<CourseCategoriesModels>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddCourseCategory