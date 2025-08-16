import { GetEducationalCourseProgramModel, SearchProgramModel } from "@/app/Domain/M_Education/Programs";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetPrograms = async (searchKey: SearchProgramModel, page: number = 1) => {
//   let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetEducationalCourseProgram`;
//   let method: string = 'post';
//   let data = {
//     "pageNo": page,
//     "pageSize": 10,
//     "searchKeys": {
//       "name": searchKey.name,
//       "coachName": searchKey.coachName,
//       "instituteName": searchKey.instituteName,
//       "participant": searchKey.participant,
//       "personnel": searchKey.personnel,
//       "finishDateBefore": searchKey.finishDateBefore,
//       "finishDateAfter": searchKey.finishDateAfter,
//       "creationDateBefore": searchKey.creationDateBefore,
//       "creationDateAfter": searchKey.creationDateAfter,
//       "categoryName": searchKey.categoryName,
//       "courseCode": searchKey.courseCode
//     }
//   }
//   let response: AxiosResponse<Response<GetEducationalCourseProgramModel>> = await useAxios({ url, method, data, credentials: true })
//   return response;
// }
// export default GetPrograms
const GetPrograms = () => {
  const { AxiosRequest } = useAxios();
  const Function = async (searchKey: SearchProgramModel, page: number = 1) => {
    let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetEducationalCourseProgram`;
  let method: string = 'post';
  let data = {
    "pageNo": page,
    "pageSize": 10,
    "searchKeys": {
      "name": searchKey.name,
      "coachName": searchKey.coachName,
      "instituteName": searchKey.instituteName,
      "participant": searchKey.participant,
      "personnel": searchKey.personnel,
      "finishDateBefore": searchKey.finishDateBefore,
      "finishDateAfter": searchKey.finishDateAfter,
      "creationDateBefore": searchKey.creationDateBefore,
      "creationDateAfter": searchKey.creationDateAfter,
      "categoryName": searchKey.categoryName,
      "courseCode": searchKey.courseCode
    }
  }
  let response: AxiosResponse<Response<GetEducationalCourseProgramModel>> = await AxiosRequest({ url, method, data, credentials: true })
      return response;
  }
  return { Function }
}
export default GetPrograms