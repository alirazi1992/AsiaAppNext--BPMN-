import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";
import { EducationalCourseProgramsModel, ProgramItemsModel } from "@/app/Domain/M_Education/Programs";

// export async function AddCourseProgram(dataItems: ProgramItemsModel) {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddCourseProgram`;
//     let method: string = 'put';
//     let data = {
//         "educationalCourseId": dataItems.educationalCourseId,
//         "coachName": dataItems.coachFaName,
//         "coachFaName": dataItems.coachFaName,
//         "duration": dataItems.duration,
//         "durationUnit": dataItems.durationUnit,
//         "faDurationUnit": dataItems.faDurationUnit,
//         "instituteName": dataItems.instituteName,
//         "instituteFaName": dataItems.instituteFaName,
//         "finishDate": dataItems.finishDate,
//         "faPage2Desc": dataItems.page2FaDesc,
//         "page2Desc": dataItems.page2Desc,
//         "validPeriod": dataItems.validPeriod
//     };
//     let response: AxiosResponse<Response<EducationalCourseProgramsModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const AddCourseProgram = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (dataItems: ProgramItemsModel) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/AddCourseProgram`;
        let method: string = 'put';
        let data = {
            "educationalCourseId": dataItems.educationalCourseId,
            "coachName": dataItems.coachFaName,
            "coachFaName": dataItems.coachFaName,
            "duration": dataItems.duration,
            "durationUnit": dataItems.durationUnit,
            "faDurationUnit": dataItems.faDurationUnit,
            "instituteName": dataItems.instituteName,
            "instituteFaName": dataItems.instituteFaName,
            "finishDate": dataItems.finishDate,
            "faPage2Desc": dataItems.page2FaDesc,
            "page2Desc": dataItems.page2Desc,
            "validPeriod": dataItems.validPeriod
        };
        let response: AxiosResponse<Response<EducationalCourseProgramsModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default AddCourseProgram