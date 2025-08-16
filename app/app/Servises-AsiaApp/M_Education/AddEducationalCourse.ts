import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { CourseItemsModel, EducationCoursesModel } from "@/app/Domain/M_Education/Courses";

// export async function AddEducationaCourse(dataItems: CourseItemsModel) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddNewEducationalCourse`;
//     let method: string = 'put';
//     let data = {
//         "name": dataItems.name,
//         "faName": dataItems.faName,
//         "courseCategoryId": dataItems.courseCategoryId,
//         "courseDesc": dataItems.courseDesc,
//         "faCourseDesc": dataItems.faCourseDesc,
//         "templateId": dataItems.templateId,
//         "courseCode": dataItems.courseCode
//     };
//     let response: AxiosResponse<Response<EducationCoursesModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const AddEducationaCourse = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: CourseItemsModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddNewEducationalCourse`;
    let method: string = 'put';
    let data = {
        "name": dataItems.name,
        "faName": dataItems.faName,
        "courseCategoryId": dataItems.courseCategoryId,
        "courseDesc": dataItems.courseDesc,
        "faCourseDesc": dataItems.faCourseDesc,
        "templateId": dataItems.templateId,
        "courseCode": dataItems.courseCode
    };
    let response: AxiosResponse<Response<EducationCoursesModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddEducationaCourse