import { CategoryItemsModel } from "@/app/Domain/M_Education/Categories";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const UpdateCourseCategory = async (dataItems: CategoryItemsModel) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/UpdateCourseCategory`;
//     let method: string = 'patch';
//     let data = {
//         "id": dataItems.id,
//         "name": dataItems.name,
//         "faName": dataItems.faName
//     }
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default UpdateCourseCategory

const UpdateCourseCategory = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: CategoryItemsModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/UpdateCourseCategory`;
        let method: string = 'patch';
        let data = {
            "id": dataItems.id,
            "name": dataItems.name,
            "faName": dataItems.faName
        }
        let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UpdateCourseCategory
