import { EducationalCourseProgramsModel, ProgramItemsModel } from "@/app/Domain/M_Education/Programs";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const UpdateCourseProgram = async (dataItems: ProgramItemsModel) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/UpdateCourseProgram`;
//     let method: string = 'patch';
//     let data = {
//         "id": dataItems.id,
//         "educationalCourseId": dataItems.educationalCourseId,
//         "coachName": dataItems.coachName,
//         "coachFaName": dataItems.coachFaName,
//         "duration": dataItems.duration,
//         "durationUnit": dataItems.durationUnit,
//         "faDurationUnit": dataItems.faDurationUnit,
//         "instituteName": dataItems.instituteName,
//         "instituteFaName": dataItems.instituteFaName,
//         "faPage2Desc": dataItems.page2FaDesc,
//         "page2Desc": dataItems.page2Desc,
//         "finishDate": dataItems.finishDate,
//         "validPeriod": dataItems.validPeriod
//     }
//     let response: AxiosResponse<Response<EducationalCourseProgramsModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default UpdateCourseProgram

const UpdateCourseProgram = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: ProgramItemsModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/UpdateCourseProgram`;
    let method: string = 'patch';
    let data = {
        "id": dataItems.id,
        "educationalCourseId": dataItems.educationalCourseId,
        "coachName": dataItems.coachName,
        "coachFaName": dataItems.coachFaName,
        "duration": dataItems.duration,
        "durationUnit": dataItems.durationUnit,
        "faDurationUnit": dataItems.faDurationUnit,
        "instituteName": dataItems.instituteName,
        "instituteFaName": dataItems.instituteFaName,
        "faPage2Desc": dataItems.page2FaDesc,
        "page2Desc": dataItems.page2Desc,
        "finishDate": dataItems.finishDate,
        "validPeriod": dataItems.validPeriod
    }
    let response: AxiosResponse<Response<EducationalCourseProgramsModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default UpdateCourseProgram

