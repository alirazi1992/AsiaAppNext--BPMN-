import { FilterResumeModel, GetSearchResumeModel } from "@/app/Domain/M_HumanRecourse/ManageResume";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// export const GetSearchResume = async (list: FilterResumeModel, page: number = 1) => {
//     let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetSearchResume`;
//     let method = 'post';
//     let data = {
//         "searchParams": {
//             "nationalCode": list.nationalCode,
//             "name": list.name,
//             "lastName": list.lastname,
//             "faName": list.faName,
//             "faLastName": list.faLastname,
//             "jobBranchId": list.jobBranchId,
//             "jobVacancyId": list.jobVacancyId,
//             "createDateFrom": list.startDate,
//             "createDateTo": list.endDate,
//             "isSelected": list.isSelect
//         },
//         "count": 10,
//         "page": page
//     };
//     let response: AxiosResponse<Response<GetSearchResumeModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }

const GetSearchResume = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (list: FilterResumeModel, page: number = 1) => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/Resume/Search/GetSearchResume`;
        let method = 'post';
        let data = {
            "searchParams": {
                "nationalCode": list.nationalCode,
                "name": list.name,
                "lastName": list.lastname,
                "faName": list.faName,
                "faLastName": list.faLastname,
                "jobBranchId": list.jobBranchId,
                "jobVacancyId": list.jobVacancyId,
                "createDateFrom": list.startDate,
                "createDateTo": list.endDate,
                "isSelected": list.isSelect
            },
            "count": 10,
            "page": page
        };
        let response: AxiosResponse<Response<GetSearchResumeModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetSearchResume
