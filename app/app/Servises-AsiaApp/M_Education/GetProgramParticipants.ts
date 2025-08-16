import { GetProgramParticipantsModel, SearchKeyModel } from "@/app/Domain/M_Education/Participant";
import { Response } from "@/app/Domain/shared";
import useAxios from "@/app/hooks/useAxios";
import { AxiosResponse } from "axios";

// const GetProgramParticipants = async (searchKey: SearchKeyModel, page: number = 1) => {
//     let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetProgramParticipants`;
//     let method: string = 'post';
//     let data = {
//         "pageNo": page,
//         "pageSize": 10,
//         "searchKeys": {
//             courseProgramId: searchKey.courseProgramId,
//             faName: searchKey.faName,
//             name: searchKey.name,
//             nationalCode: searchKey.nationalCode
//         }
//     }
//     let response: AxiosResponse<Response<GetProgramParticipantsModel>> = await useAxios({ url, method, data, credentials: true })
//     return response;
// }
// export default GetProgramParticipants

const GetProgramParticipants = () => {
    const { AxiosRequest } = useAxios();
    const Function = async (searchKey: SearchKeyModel, page: number = 1) => {
        let url: string = `${process.env.NEXT_PUBLIC_API_URL}/Education/manage/GetProgramParticipants`;
        let method: string = 'post';
        let data = {
            "pageNo": page,
            "pageSize": 10,
            "searchKeys": {
                courseProgramId: searchKey.courseProgramId,
                faName: searchKey.faName,
                name: searchKey.name,
                nationalCode: searchKey.nationalCode
            }
        }
        let response: AxiosResponse<Response<GetProgramParticipantsModel>> = await AxiosRequest({ url, method, data, credentials: true })
        return response;
    }
    return { Function }
}
export default GetProgramParticipants