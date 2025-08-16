
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { GetCoursesListModel } from "@/app/Domain/M_Education/Programs";

// const GetCoursesList = async () => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetEducationalCoursesList`;
//     let method: string = 'get';
//     let data = {}
//     let response: AxiosResponse<Response<GetCoursesListModel[]>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetCoursesList;

const GetCoursesList = () => {
    const { AxiosRequest } = useAxios();
    const Function = async () => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetEducationalCoursesList`;
    let method: string = 'get';
    let data = {}
    let response: AxiosResponse<Response<GetCoursesListModel[]>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetCoursesList