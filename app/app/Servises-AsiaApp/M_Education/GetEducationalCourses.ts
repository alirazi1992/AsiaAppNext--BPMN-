import { GetCoursesModel } from "@/app/Domain/M_Education/Courses";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetEducationalCourses = async (searchKey: string = '', page: number = 1) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetEducationalCourses`;
//     let method: string = 'post';
//     let data = {
//         "pageCount": 10,
//         "pageNo": page,
//         "searchKey": searchKey
//     }
//     let response: AxiosResponse<Response<GetCoursesModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetEducationalCourses

const GetEducationalCourses = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (searchKey: string = '', page: number = 1) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetEducationalCourses`;
        let method: string = 'post';
        let data = {
            "pageCount": 10,
            "pageNo": page,
            "searchKey": searchKey
        }
        let response: AxiosResponse<Response<GetCoursesModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
  }
  export default GetEducationalCourses
