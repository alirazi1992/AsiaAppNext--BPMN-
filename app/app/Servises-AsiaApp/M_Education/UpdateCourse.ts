import { CourseItemsModel } from "@/app/Domain/M_Education/Courses";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const UpdateEducationalCourse = async (dataItems: CourseItemsModel) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/UpdateEducationalCourse`;
//     let method: string = 'patch';
//     let data = {
//         "id": dataItems.id,
//         "name": dataItems.name,
//         "faName": dataItems.faName,
//         "courseCategoryId": dataItems.courseCategoryId,
//         "courseDesc": dataItems.courseDesc,
//         "faCourseDesc": dataItems.faCourseDesc,
//         "templateId": dataItems.templateId, 
//         "courseCode": dataItems.courseCode
//     }
//     let response: AxiosResponse<Response<boolean>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default UpdateEducationalCourse

const UpdateEducationalCourse = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: CourseItemsModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/UpdateEducationalCourse`;
    let method: string = 'patch';
    let data = {
        "id": dataItems.id,
        "name": dataItems.name,
        "faName": dataItems.faName,
        "courseCategoryId": dataItems.courseCategoryId,
        "courseDesc": dataItems.courseDesc,
        "faCourseDesc": dataItems.faCourseDesc,
        "templateId": dataItems.templateId, 
        "courseCode": dataItems.courseCode
    }
    let response: AxiosResponse<Response<boolean>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UpdateEducationalCourse
